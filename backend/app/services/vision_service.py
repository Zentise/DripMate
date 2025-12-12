import os
from typing import Dict, Optional, List
import json

try:
    import google.generativeai as genai
    import os

    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    if GEMINI_API_KEY:
        genai.configure(api_key=GEMINI_API_KEY)
        _gemini_model = genai.GenerativeModel('gemini-2.5-flash')
        
    else:
        _gemini_model = None
except Exception as _e:
    print(f"[vision] Google Gemini not available: {_e}")
    _gemini_model = None

try:
    import torch
    import torchvision.transforms as T
    from torchvision import models
except Exception as _e:
    print(f"[vision] Torch/torchvision not available: {_e}")
    torch = None
    T = None
    models = None
from PIL import Image
try:
    import cv2
    import numpy as np
except Exception as _e:
    print(f"[vision] OpenCV/Numpy not available: {_e}")
    cv2 = None
    np = None


YOLO_WEIGHTS = os.getenv("DRIPMATE_YOLOV5_WEIGHTS", os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "models", "yolov5s.pt")))
RESNET_WEIGHTS = os.getenv("DRIPMATE_RESNET50_WEIGHTS")  # Optional explicit path

_device = torch.device("cuda" if (torch and torch.cuda.is_available()) else "cpu") if torch else "cpu"
_resnet = None
_resnet_labels = None
_yolo = None


def _load_resnet():
    global _resnet, _resnet_labels
    if _resnet is not None:
        return _resnet
    if not models or not torch:
        return None
    try:
        if RESNET_WEIGHTS and os.path.exists(RESNET_WEIGHTS):
            model = models.resnet50()
            state = torch.load(RESNET_WEIGHTS, map_location=_device)
            model.load_state_dict(state)
        else:
            # Uses torchvision built-in pretrained weights; will require cache or internet
            model = models.resnet50(weights=models.ResNet50_Weights.IMAGENET1K_V2)
        model.eval().to(_device)
        _resnet = model
        _resnet_labels = models.ResNet50_Weights.IMAGENET1K_V2.meta.get("categories")
    except Exception as e:
        print(f"[vision] ResNet load failed: {e}")
        _resnet = None
    return _resnet


def _load_yolo():
    global _yolo
    if _yolo is not None:
        return _yolo
    if not torch:
        return None
    try:
        if os.path.exists(YOLO_WEIGHTS):
            _yolo = torch.hub.load('ultralytics/yolov5', 'custom', path=YOLO_WEIGHTS, trust_repo=True)
        else:
            # As a fallback (requires internet the first time)
            _yolo = torch.hub.load('ultralytics/yolov5', 'yolov5s', trust_repo=True)
        _yolo.to(_device)
        _yolo.eval()
    except Exception as e:
        print(f"[vision] YOLO load failed: {e}")
        _yolo = None
    return _yolo


_preprocess = (
    T.Compose([
        T.Resize(256),
        T.CenterCrop(224),
        T.ToTensor(),
        T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ]) if T else None
)


def analyze_image(image_path: str) -> Dict[str, Optional[str]]:
    """
    Analyze an image and return wardrobe attributes.
    Returns keys: category, name, color, pattern, style, season
    """
    # Try YOLO for accessory hints (handbag/backpack/tie), otherwise fallback to ResNet label mapping
    category_hint = None
    name_hint = None

    yolo = _load_yolo()
    if yolo is not None:
        try:
            results = yolo(image_path)
            df = results.pandas().xyxy[0]
            # Prefer accessory-like classes if present
            for _, row in df.sort_values('confidence', ascending=False).iterrows():
                cls = str(row['name']).lower()
                if cls in {"handbag", "backpack", "tie", "umbrella", "suitcase"}:
                    category_hint = "accessory"
                    name_hint = cls
                    break
                if cls in {"sneaker", "sports ball", "skateboard", "snowboard", "surfboard", "skis"}:
                    # Sneaker is on COCO as 'sports ball' not footwear; try 'person' context is noisy
                    pass
        except Exception as e:
            print(f"[vision] YOLO inference error: {e}")

    # Color extraction via OpenCV k-means
    color_hex, color_name = _extract_dominant_color(image_path)

    # ResNet classification for clothing-ish labels
    top_label = None
    top5 = []
    resnet = _load_resnet()
    if resnet is not None and _preprocess is not None and torch is not None:
        try:
            img = Image.open(image_path).convert('RGB')
            inp = _preprocess(img).unsqueeze(0).to(_device)
            with torch.no_grad():
                logits = resnet(inp)
                probs = torch.nn.functional.softmax(logits, dim=1)
                topk = torch.topk(probs, k=5)
            idxs = topk.indices.squeeze(0).tolist()
            confs = topk.values.squeeze(0).tolist()
            for i, c in zip(idxs, confs):
                label = _resnet_labels[i] if _resnet_labels else str(i)
                top5.append((label, float(c)))
            top_label = top5[0][0] if top5 else None
        except Exception as e:
            print(f"[vision] ResNet inference error: {e}")

    # Map to our schema
    category, name = _infer_category_and_name(category_hint, name_hint, top5)
    pattern = _infer_pattern_from_labels(top5)
    style = _infer_style_from_labels(top5)
    season = _guess_season(name or top_label)

    return {
        "category": category,
        "name": name,
        "color": color_name or color_hex,
        "pattern": pattern,
        "style": style,
        "season": season,
    }


def _extract_dominant_color(image_path: str, k: int = 3) -> tuple[str, str]:
    if cv2 is None or np is None:
        return "#808080", "grey"
    img = cv2.imread(image_path)
    if img is None:
        return "#808080", "grey"
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    pixels = img.reshape((-1, 3)).astype(np.float32)
    # criteria: type, max_iter, epsilon
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 20, 1.0)
    try:
        _, labels, centers = cv2.kmeans(pixels, k, None, criteria, 3, cv2.KMEANS_PP_CENTERS)
        counts = np.bincount(labels.flatten())
        dom = centers[np.argmax(counts)]
        r, g, b = [int(x) for x in dom]
        hex_color = f"#{r:02x}{g:02x}{b:02x}"
        return hex_color, _nearest_basic_color((r, g, b))
    except Exception:
        return "#808080", "grey"


_BASIC_COLORS = {
    "black": (0, 0, 0),
    "white": (255, 255, 255),
    "grey": (128, 128, 128),
    "red": (220, 20, 60),
    "orange": (255, 140, 0),
    "yellow": (255, 215, 0),
    "green": (34, 139, 34),
    "teal": (0, 128, 128),
    "blue": (30, 144, 255),
    "navy": (0, 0, 128),
    "purple": (138, 43, 226),
    "pink": (255, 105, 180),
    "brown": (139, 69, 19),
    "beige": (245, 245, 220),
    "olive": (128, 128, 0),
}


def _nearest_basic_color(rgb: tuple) -> str:
    r, g, b = rgb
    best, bestd = "grey", 1e9
    for name, (rr, gg, bb) in _BASIC_COLORS.items():
        d = (r-rr)**2 + (g-gg)**2 + (b-bb)**2
        if d < bestd:
            best, bestd = name, d
    return best


def _infer_category_and_name(cat_hint: Optional[str], name_hint: Optional[str], top5: list) -> tuple[Optional[str], Optional[str]]:
    # Start with YOLO hint if present
    if cat_hint:
        return cat_hint, name_hint

    # Map some ImageNet clothing-related labels to our categories
    label_text = ", ".join([t for t, _ in top5]).lower()
    mapping = [
        ("shoe", ("footwear", "sneakers")),
        ("sandal", ("footwear", "sandals")),
        ("loafer", ("footwear", "loafers")),
        ("running shoe", ("footwear", "running shoes")),
        ("boot", ("footwear", "boots")),
        ("jersey", ("clothing", "jersey")),
        ("suit", ("clothing", "suit")),
        ("gown", ("clothing", "gown")),
        ("t-shirt", ("clothing", "t-shirt")),
        ("sweatshirt", ("clothing", "sweatshirt")),
        ("cardigan", ("clothing", "cardigan")),
        ("jean", ("clothing", "jeans")),
        ("trouser", ("clothing", "trousers")),
        ("kurta", ("clothing", "kurta")),
        ("sari", ("clothing", "sari")),
        ("hoodie", ("clothing", "hoodie")),
        ("jacket", ("clothing", "jacket")),
        ("coat", ("clothing", "coat")),
        ("blazer", ("clothing", "blazer")),
        ("shirt", ("clothing", "shirt")),
        ("skirt", ("clothing", "skirt")),
        ("shorts", ("clothing", "shorts")),
        ("handbag", ("accessory", "handbag")),
        ("backpack", ("accessory", "backpack")),
        ("tie", ("accessory", "tie")),
        ("belt", ("accessory", "belt")),
        ("necklace", ("accessory", "necklace")),
        ("sunglasses", ("accessory", "sunglasses")),
        ("scarf", ("accessory", "scarf")),
        ("dupatta", ("accessory", "dupatta")),
    ]
    for key, val in mapping:
        if key in label_text:
            return val
    # Default unknown
    return None, None


def _infer_pattern_from_labels(top5: list) -> Optional[str]:
    text = ", ".join([t for t, _ in top5]).lower()
    for k in ["striped", "plaid", "check", "checked", "paisley", "floral", "polka", "camouflage", "leopard", "houndstooth", "embroid"]:
        if k in text:
            return k if k != "embroid" else "embroidered"
    return None


def _infer_style_from_labels(top5: list) -> Optional[str]:
    text = ", ".join([t for t, _ in top5]).lower()
    if any(k in text for k in ["formal", "suit", "blazer", "gown", "dress shoe"]):
        return "formal"
    if any(k in text for k in ["sneaker", "t-shirt", "hoodie", "jean", "jersey"]):
        return "casual"
    if any(k in text for k in ["boot", "coat", "jacket"]):
        return "streetwear"
    return None


def _guess_season(name: Optional[str]) -> Optional[str]:
    if not name:
        return None
    n = name.lower()
    if any(w in n for w in ["hoodie", "coat", "jacket", "scarf", "turtleneck", "sweatshirt", "boots"]):
        return "winter"
    if any(w in n for w in ["t-shirt", "kurta", "sandal", "shorts", "linen"]):
        return "summer"
    if any(w in n for w in ["blazer", "cardigan", "denim", "bomber"]):
        return "fall"
    return "all-season"


def analyze_clothing_with_gemini(image_path: str) -> Dict[str, Optional[str]]:
    """
    Analyze clothing image using Gemini Vision API.
    Returns: {category, name, color, pattern, style, season, description}
    """
    if not _gemini_model:
        return {
            "category": None,
            "name": None,
            "color": None,
            "pattern": None,
            "style": None,
            "season": None,
            "description": "Gemini API not configured"
        }
    
    try:
        img = Image.open(image_path)
        prompt = """Analyze this clothing item image and provide a JSON response with the following fields:
- category: one of "clothing", "footwear", or "accessory"
- name: specific item name (e.g., "black hoodie", "blue jeans", "white sneakers")
- color: dominant color (e.g., "black", "blue", "white", "red")
- pattern: pattern type if visible (e.g., "striped", "plain", "floral", "checked") or null
- style: style category (e.g., "casual", "formal", "streetwear", "sporty") or null
- season: best season (e.g., "summer", "winter", "all-season", "fall", "spring") or null
- description: brief 1-2 sentence description of the item

Return ONLY valid JSON, no markdown or extra text."""
        
        response = _gemini_model.generate_content([prompt, img])
        text = response.text.strip()
        
        # Clean up response - remove markdown code blocks if present
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()
        
        result = json.loads(text)
        return result
    except Exception as e:
        print(f"[vision] Gemini analysis error: {e}")
        return {
            "category": None,
            "name": None,
            "color": None,
            "pattern": None,
            "style": None,
            "season": None,
            "description": f"Analysis failed: {str(e)}"
        }


def get_outfit_from_image(image_path: str, user_prompt: Optional[str] = None, wardrobe_items: Optional[List[Dict]] = None) -> Dict:
    """
    Analyze a clothing item image and suggest complete outfit combinations.
    Returns: {detected_item, outfits: [{name, item1, item2, footwear, accessories, reason}]}
    """
    if not _gemini_model:
        return {
            "error": "Gemini API not configured. Please set GEMINI_API_KEY environment variable.",
            "detected_item": None,
            "outfits": []
        }
    
    try:
        img = Image.open(image_path)
        
        # First, analyze the clothing item
        detected = analyze_clothing_with_gemini(image_path)
        
        # Build wardrobe context if provided
        wardrobe_context = ""
        if wardrobe_items:
            wardrobe_list = "\n".join([
                f"- {item.get('category', 'item')}: {item.get('name', 'unknown')} ({item.get('color', 'color unknown')})"
                for item in wardrobe_items
            ])
            wardrobe_context = f"\n\nUser's wardrobe items:\n{wardrobe_list}\n\nPlease suggest outfits using items from this wardrobe when possible."
        
        # Build outfit suggestion prompt
        user_context = f" {user_prompt}" if user_prompt else ""
        prompt = f"""Based on this clothing item image, suggest 3 complete outfit combinations.{user_context}

Detected item: {detected.get('name', 'unknown item')} - {detected.get('description', '')}{wardrobe_context}

Provide outfit suggestions in JSON format:
{{
  "outfits": [
    {{
      "name": "outfit name",
      "item1": {{"name": "top/shirt item", "id": null}},
      "item2": {{"name": "bottom/pants item", "id": null}},
      "footwear": {{"name": "shoe item", "id": null}},
      "accessories": {{"name": "accessory items", "id": null}},
      "reason": "why this outfit works"
    }}
  ]
}}

Rules:
1. Include the detected item in EVERY outfit suggestion
2. Each outfit must have item1, item2, footwear, and accessories (can be "none" for accessories)
3. Make suggestions practical, stylish, and complementary to the detected item
4. Provide clear reasoning for each outfit
5. Return ONLY valid JSON, no markdown or extra text"""
        
        response = _gemini_model.generate_content([prompt, img])
        text = response.text.strip()
        
        # Clean up response
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()
        
        result = json.loads(text)
        
        return {
            "detected_item": detected,
            "outfits": result.get("outfits", [])
        }
    except Exception as e:
        print(f"[vision] Gemini outfit suggestion error: {e}")
        return {
            "error": f"Failed to generate outfit suggestions: {str(e)}",
            "detected_item": None,
            "outfits": []
        }

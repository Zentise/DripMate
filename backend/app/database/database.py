from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# The URL for our SQLite database.
# 'sqlite:///./drip_mate.db' means it will create a file named 'drip_mate.db'
# in the main 'backend' directory.
SQLALCHEMY_DATABASE_URL = "sqlite:///./drip_mate.db"

# The 'engine' is the core interface to the database.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# A SessionLocal class will be used to create individual database sessions (conversations).
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base will be used by our model classes (like the 'Cloth' model).
Base = declarative_base()

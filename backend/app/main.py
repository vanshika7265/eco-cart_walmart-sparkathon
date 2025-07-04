from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from app.data_loader import load_data
from app.score_engine import calculate_score
from app.recommender import recommend_alternatives
from fastapi.middleware.cors import CORSMiddleware
origins = [
    "*",  # allow all for now, or replace with your frontend domain
    # Example: "https://eco-cart-frontend.vercel.app"
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load data
df = load_data()

# Request model
class CartRequest(BaseModel):
    cart: List[str]

@app.get("/")
def root():
    return {"message": "EchoCart API is running 🚀"}

@app.post("/analyze-cart")
async def analyze_cart(cart_request: CartRequest):
    try:
        cart = cart_request.cart
        print("Cart received:", cart)
        result = calculate_score(cart, df)
        return result
    except Exception as e:
        return {"error": str(e)}
@app.post("/recommendations")
async def get_recommendations(cart_request: CartRequest):
    cart = cart_request.cart
    suggestions = recommend_alternatives(cart, df)
    return {"recommendations": suggestions}
@app.get("/products")
def get_products():
    df = load_data()
    products = df.to_dict(orient="records")
    return products

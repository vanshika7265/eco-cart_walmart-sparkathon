def calculate_score(cart_items, df):
    if not cart_items:
        return {
            "green_score": 0,
            "totals": {"carbon": 0, "water": 0, "packaging": 0},
            "details": []
        }

    # Filter rows in the dataset matching items in the cart
    cart_df = df[df['product_name'].isin(cart_items)]

    # If no items matched
    if cart_df.empty:
        return {
            "green_score": 0,
            "totals": {"carbon": 0, "water": 0, "packaging": 0},
            "details": []
        }

    # Calculate total impact
    total_carbon = cart_df['carbon'].sum()
    total_water = cart_df['water'].sum()
    total_packaging = cart_df['packaging'].sum()

    # Normalize the green score (you can tweak this logic)
    raw_score = 100 - (total_carbon / 50 + total_water / 1000 + total_packaging)
    green_score = max(0, min(round(raw_score, 2), 100))

    # Add per-product details (optional, helps frontend)
    details = []
    for _, row in cart_df.iterrows():
        details.append({
            "product_name": row["product_name"],
            "category": row["category"],
            "carbon": row["carbon"],
            "water": row["water"],
            "packaging": row["packaging"],
            "ethics_score": row["ethics_score"]
        })

        return {
        "green_score": float(green_score),
        "totals": {
            "carbon": int(total_carbon),
            "water": float(total_water),
            "packaging": int(total_packaging)
        },
        "details": [
            {
                "product_name": str(row["product_name"]),
                "category": str(row["category"]),
                "carbon": int(row["carbon"]),
                "water": float(row["water"]),
                "packaging": int(row["packaging"]),
                "ethics_score": int(row["ethics_score"])
            }
            for _, row in cart_df.iterrows()
        ]
    }


def recommend_alternatives(cart_items, df):
    recommendations = []

    for item in cart_items:
        # Get original product details
        original = df[df['product_name'] == item]
        if original.empty:
            continue  # skip unknown product

        original_row = original.iloc[0]
        category = original_row['category']
        original_score = (
            original_row['carbon'] +
            original_row['water'] +
            original_row['packaging']
        )

        # Find all other products in same category
        same_category = df[(df['category'] == category) & (df['product_name'] != item)]

        # Calculate scores and find best alternative
        best_alt = None
        best_score = original_score  # initialize with current score

        for _, row in same_category.iterrows():
            score = row['carbon'] + row['water'] + row['packaging']
            if score < best_score:
                best_score = score
                best_alt = row

        if best_alt is not None:
            recommendations.append({
                "original_product": item,
                "recommended_product": best_alt["product_name"],
                "category": category,
                "reason": f"Lower total impact: {round(best_score, 2)} vs {round(original_score, 2)}",
                "impact_comparison": {
                    "carbon": {
                        "original": int(original_row['carbon']),
                        "alternative": int(best_alt['carbon'])
                    },
                    "water": {
                        "original": float(original_row['water']),
                        "alternative": float(best_alt['water'])
                    },
                    "packaging": {
                        "original": int(original_row['packaging']),
                        "alternative": int(best_alt['packaging'])
                    }
                }
            })

    return recommendations

import pandas as pd
import os

def load_data():
    file_path = os.path.join(os.path.dirname(__file__), '../data/sustainability.csv')
    df = pd.read_csv(file_path)
    return df

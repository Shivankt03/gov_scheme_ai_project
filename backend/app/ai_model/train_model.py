import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib


# Load your dataset
def load_data(file_path):
    data = pd.read_csv(file_path)
    return data


# Preprocess the data
def preprocess_data(data):
    # Example preprocessing steps
    data.fillna(0, inplace=True)  # Fill missing values
    X = data.drop('target', axis=1)  # Features
    y = data['target']  # Target variable
    return X, y


# Train the model
def train_model(X, y):
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = RandomForestClassifier()
    model.fit(X_train, y_train)

    # Evaluate the model
    predictions = model.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)
    print(f'Model Accuracy: {accuracy * 100:.2f}%')

    return model


# Save the model
def save_model(model, file_path):
    joblib.dump(model, file_path)


# Load a saved model
def load_model(file_path):
    return joblib.load(file_path)


if __name__ == "__main__":
    data = load_data('path/to/your/dataset.csv')  # Specify your dataset path
    X, y = preprocess_data(data)
    model = train_model(X, y)
    save_model(model, 'model.pkl')  # Save the trained model

# Government Scheme AI Project

This project is designed to provide a comprehensive platform for managing government schemes using artificial intelligence. It consists of a backend built with FastAPI and a frontend developed with HTML, CSS, and JavaScript.

## Project Structure

```
gov_scheme_ai_project
├── README.md
├── .gitignore
├── backend
│   ├── requirements.txt
│   ├── .env.example
│   └── app
│       ├── main.py
│       ├── database.py
│       ├── models.py
│       ├── schemas.py
│       ├── auth.py
│       ├── config.py
│       ├── routers
│       │   ├── user_routes.py
│       │   ├── scheme_routes.py
│       │   └── admin_routes.py
│       ├── services
│       │   ├── eligibility_engine.py
│       │   ├── recommendation_engine.py
│       │   └── document_generator.py
│       ├── ai_model
│       │   ├── train_model.py
│       │   └── model.pkl
│       └── utils
│           └── helpers.py
└── frontend
    ├── index.html
    ├── login.html
    ├── dashboard.html
    ├── css
    │   └── styles.css
    └── js
        └── app.js
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd gov_scheme_ai_project
   ```

2. **Backend Setup:**
   - Navigate to the `backend` directory.
   - Create a virtual environment and activate it:
     ```bash
     python -m venv venv
     source venv/bin/activate  # On Windows use `venv\Scripts\activate`
     ```
   - Install the required dependencies:
     ```bash
     pip install -r requirements.txt
     ```
   - Copy the `.env.example` to `.env` and configure your environment variables.

3. **Run the Backend:**
   ```bash
   uvicorn app.main:app --reload
   ```

4. **Frontend Setup:**
   - Open the `frontend/index.html` file in a web browser to access the application.

## Usage

- Users can register and log in through the frontend.
- After logging in, users can view their dashboard, which displays relevant government schemes.
- The backend processes user data to determine eligibility and provide recommendations for schemes.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
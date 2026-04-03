from app.database import SessionLocal
from app.models import User

def make_first_user_admin():
    db = SessionLocal()
    user = db.query(User).first()
    if not user:
        print("No users found. Please register an account first.")
        return
        
    user.role = "admin"
    db.commit()
    print(f"User {user.email} (ID: {user.id}) has been successfully promoted to admin!")
    db.close()

if __name__ == "__main__":
    make_first_user_admin()

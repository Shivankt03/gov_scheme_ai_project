# import psycopg2

# try:
#     conn = psycopg2.connect(
#         host="localhost",
#         database="scheme_db",
#         user="postgres",
#         password="your_password"
#     )

#     cursor = conn.cursor()
#     cursor.execute("SELECT version();")

#     result = cursor.fetchone()
#     print("Connected Successfully!")
#     print(result)

#     conn.close()
# except Exception as e:
#     print("Connection Failed!")
#     print(e)
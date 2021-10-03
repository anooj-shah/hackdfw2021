import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("video/keys.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

def send_data(doc_id, data):
  doc_ref = db.collection('words').document(doc_id)
  doc_ref.set(data)


doc_id = '10032021'
data = {
  "num_words_read": 10,
  "read_ready": 5,
  "reading_speed": 100,
  "reading_streak": 1,
  "speed": 100,
  "words_correct": 1,
  "words_wrong": 5
}

send_data(doc_id, data)
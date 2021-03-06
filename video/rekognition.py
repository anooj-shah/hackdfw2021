import csv
import boto3
import pyttsx3
import re
import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("video/keys.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

language = 'en'

class Rekognizer(object):
  def __init__(self):
    with open('credentials.csv', 'r') as input:
      next(input)
      reader = csv.reader(input)
      for line in reader:
        access_key_id = line[2]
        secret_access_key = line[3]

    self.client = boto3.client('rekognition', aws_access_key_id = access_key_id, aws_secret_access_key = secret_access_key, region_name='us-west-2')
    self.engine = pyttsx3.init()

  def change_speed(self, new_speed=125):
    rate = self.engine.getProperty('rate')          # getting details of current speaking rate
    print(rate)                                     # printing current voice rate
    self.engine.setProperty('rate', new_speed)      # setting up new voice rate

  def get_speed_from_firestore(self, session_id="10032021"):
    doc = db.collection('sessions').document(session_id).get()
    data = doc.to_dict()
    print(data['speed'])
 
  def write_speed_to_firestore(self, speed, session_id="10032021"):
    doc_ref = db.collection('sessions').document(session_id)
    doc_ref.set({
        'speed': speed,
    })

  def send_text_to_firestore(self, text, session_id="10032021"):
    doc_ref = db.collection('sessions').document(session_id)
    doc = db.collection('sessions').document(session_id).get()
    data = doc.to_dict()
    doc_ref.update({
      'text': text
    })

  def update_num_words_read(self, num_words, session_id="10032021"):
    doc = db.collection('sessions').document(session_id).get()
    data = doc.to_dict()
    old_num_words = data['num_words_read']
    doc_ref = db.collection('sessions').document(session_id)
    doc = db.collection('sessions').document(session_id).get()
    data = doc.to_dict()
    doc_ref.update({
      'num_words_read': num_words + old_num_words
    })

  def get_previous_text_from_firestore(self, session_id="10032021"):
    doc = db.collection('sessions').document(session_id).get()
    data = doc.to_dict()
    previous_text = data['previous_text']
    return previous_text

  def detect_words(self, photo_path):
    photo = photo_path
    global_text = ''
    with open(photo, 'rb') as source_image:
      source_bytes = source_image.read()

      response = self.client.detect_text(Image={'Bytes': source_bytes })


      text = ''
      for idx, words in enumerate(response['TextDetections']):
        if 'ParentId' in words:
          break
        # text += re.sub(r'[^\w]', ' ', words['DetectedText']) + ' '
        text += words['DetectedText'] + ' '
    
      print(text)
      global_text = text
    return global_text

  def speak_words(self, text):
    self.engine.say(text)
    self.engine.runAndWait()
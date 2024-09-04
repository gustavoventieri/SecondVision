from __future__ import print_function
import dbus
import dbus.exceptions
import dbus.mainloop.glib
import dbus.service
import array
import sys
import gi
try:
    from gi.repository import GLib
except ImportError:
    print("Erro ao importar o GLib")
import advertising
import gatt_server
import argparse
import threading

# Importações adicionais para YOLO e PyTesseract
import cv2
from ultralytics import YOLO
import pytesseract
import time
from collections import deque
from spellchecker import SpellChecker

spell = SpellChecker(language='pt')

class ObjectTracker:
    def __init__(self, window_size=5):
        self.history = deque(maxlen=window_size)
        self.last_announcement = {}
        self.announcement_interval = 5  # segundos

    def update(self, detections):
        self.history.append(detections)

    def should_announce(self, object_name):
        count = sum([1 for frame in self.history if object_name in frame])
        if count >= len(self.history) // 2:
            return True
        return False

    def get_announcements(self):
        current_time = time.time()
        announcements = []

        if self.history:
            current_frame = self.history[-1]
            for obj in current_frame:
                if self.should_announce(obj):
                    if obj not in self.last_announcement or (current_time - self.last_announcement[obj]) > self.announcement_interval:
                        announcements.append(obj)
                        self.last_announcement[obj] = current_time

        return announcements


def correct_text(text):
    words = text.strip().split()
    corrected_words = [spell.correction(word) if spell.correction(word) else '' for word in words]

    return " ".join(filter(None, corrected_words))


def process_frame(frame, yolo_characteristic, tesseract_characteristic):
    # YOLO processing
    yolo_model = YOLO('yolov8n.pt')
    tracker = ObjectTracker()
    allowed_objects = ['person', 'chair']
    translation_dict = {
        'person': 'pessoa',
        'chair': 'cadeira',
    }

    results = yolo_model.predict(source=frame)
    detections = []

    for result in results:
        for box in result.boxes:
            cls_id = int(box.cls[0])
            if cls_id in result.names:
                object_name = result.names[cls_id]
                if object_name in allowed_objects:
                    translated_name = translation_dict.get(object_name, object_name)
                    detections.append(translated_name)

    tracker.update(detections)
    announcements = tracker.get_announcements()

    if announcements:
        yolo_characteristic.send_update(','.join(announcements))
        print(f"Updated GATT characteristic with: {announcements}")
    else:
        # Enviar atualização "none" se não houver detecções
        yolo_characteristic.send_update('none')
        print("Updated GATT characteristic with: 'none'")

    # PyTesseract processing
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    text = pytesseract.image_to_string(gray, lang='por')
    if text.strip():
        corrected_text = correct_text(text)
        tesseract_characteristic.send_update(f'texto: {corrected_text}')
        print(f"Updated GATT characteristic with: texto: {corrected_text}")


def camera_capture_loop(yolo_characteristic, tesseract_characteristic):
    cap = cv2.VideoCapture(0)

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        process_frame(frame, yolo_characteristic, tesseract_characteristic)

        time.sleep(1)

    cap.release()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('-a', '--adapter-name', type=str, help='Adapter name', default='')
    args = parser.parse_args()
    adapter_name = args.adapter_name

    dbus.mainloop.glib.DBusGMainLoop(set_as_default=True)
    bus = dbus.SystemBus()
    mainloop = GLib.MainLoop()

    advertising.advertising_main(mainloop, bus, adapter_name)
    app = gatt_server.gatt_server_main(mainloop, bus, adapter_name)
    yolo_characteristic = app.services[0].characteristics[0]
    tesseract_characteristic = app.services[0].characteristics[1]

    # Start camera capture loop in a separate thread
    camera_thread = threading.Thread(target=camera_capture_loop, args=(yolo_characteristic, tesseract_characteristic))
    camera_thread.start()

    try:
        mainloop.run()
    except KeyboardInterrupt:
        print("Program terminated")
        camera_thread.join()

if __name__ == '__main__':
    main()

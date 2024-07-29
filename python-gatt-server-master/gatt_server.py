import dbus
import dbus.exceptions
import dbus.mainloop.glib
import dbus.service
import functools

import exceptions
import adapters
import os

BLUEZ_SERVICE_NAME = 'org.bluez'
LE_ADVERTISING_MANAGER_IFACE = 'org.bluez.LEAdvertisingManager1'
DBUS_OM_IFACE = 'org.freedesktop.DBus.ObjectManager'
DBUS_PROP_IFACE = 'org.freedesktop.DBus.Properties'

LE_ADVERTISEMENT_IFACE = 'org.bluez.LEAdvertisement1'
GATT_MANAGER_IFACE = 'org.bluez.GattManager1'
GATT_SERVICE_IFACE = 'org.bluez.GattService1'
GATT_CHRC_IFACE = 'org.bluez.GattCharacteristic1'
GATT_DESC_IFACE = 'org.bluez.GattDescriptor1'

class Application(dbus.service.Object):
    def __init__(self, bus):
        self.path = '/'
        self.services = []
        dbus.service.Object.__init__(self, bus, self.path)
        self.add_service(TestService(bus, 0))

    def get_path(self):
        return dbus.ObjectPath(self.path)

    def add_service(self, service):
        self.services.append(service)

    @dbus.service.method(DBUS_OM_IFACE, out_signature='a{oa{sa{sv}}}')
    def GetManagedObjects(self):
        response = {}
        print('GetManagedObjects')
        for service in self.services:
            response[service.get_path()] = service.get_properties()
            chrcs = service.get_characteristics()
            for chrc in chrcs:
                response[chrc.get_path()] = chrc.get_properties()
                descs = chrc.get_descriptors()
                for desc in descs:
                    response[desc.get_path()] = desc.get_properties()
        return response

class Service(dbus.service.Object):
    PATH_BASE = '/org/bluez/example/service'
    def __init__(self, bus, index, uuid, primary):
        self.path = self.PATH_BASE + str(index)
        self.bus = bus
        self.uuid = uuid
        self.primary = primary
        self.characteristics = []
        dbus.service.Object.__init__(self, bus, self.path)

    def get_properties(self):
        return {
            GATT_SERVICE_IFACE: {
                'UUID': self.uuid,
                'Primary': self.primary,
                'Characteristics': dbus.Array(
                    self.get_characteristic_paths(),
                    signature='o')
            }
        }

    def get_path(self):
        return dbus.ObjectPath(self.path)

    def add_characteristic(self, characteristic):
        self.characteristics.append(characteristic)

    def get_characteristic_paths(self):
        result = []
        for chrc in self.characteristics:
            result.append(chrc.get_path())
        return result

    def get_characteristics(self):
        return self.characteristics

    @dbus.service.method(DBUS_PROP_IFACE,
                         in_signature='s',
                         out_signature='a{sv}')
    def GetAll(self, interface):
        if interface != GATT_SERVICE_IFACE:
            raise exceptions.InvalidArgsException()
        return self.get_properties()[GATT_SERVICE_IFACE]

class Characteristic(dbus.service.Object):
    def __init__(self, bus, index, uuid, flags, service):
        self.path = service.path + '/char' + str(index)
        self.bus = bus
        self.uuid = uuid
        self.service = service
        self.flags = flags
        self.descriptors = []
        self.value = []
        self.notifying = False
        dbus.service.Object.__init__(self, bus, self.path)

    def get_properties(self):
        return {
            GATT_CHRC_IFACE: {
                'Service': self.service.get_path(),
                'UUID': self.uuid,
                'Flags': self.flags,
                'Descriptors': dbus.Array(
                    self.get_descriptor_paths(),
                    signature='o')
            }
        }

    def get_path(self):
        return dbus.ObjectPath(self.path)

    def add_descriptor(self, descriptor):
        self.descriptors.append(descriptor)

    def get_descriptor_paths(self):
        result = []
        for desc in self.descriptors:
            result.append(desc.get_path())
        return result

    def get_descriptors(self):
        return self.descriptors

    @dbus.service.method(DBUS_PROP_IFACE,
                         in_signature='s',
                         out_signature='a{sv}')
    def GetAll(self, interface):
        if interface != GATT_CHRC_IFACE:
            raise exceptions.InvalidArgsException()
        return self.get_properties()[GATT_CHRC_IFACE]

    @dbus.service.method(GATT_CHRC_IFACE,
                         in_signature='a{sv}',
                         out_signature='ay')
    def ReadValue(self, options):
        print('TestCharacteristic Read: ' + repr(self.value))
        return self.value

    @dbus.service.method(GATT_CHRC_IFACE)
    def StartNotify(self):
        if self.notifying:
            return
        self.notifying = True
        self.PropertiesChanged(GATT_CHRC_IFACE, {'Value': self.value}, [])

    @dbus.service.method(GATT_CHRC_IFACE)
    def StopNotify(self):
        if not self.notifying:
            return
        self.notifying = False

    def send_update(self, value):
        self.set_value(value)
        if self.notifying:
            self.PropertiesChanged(GATT_CHRC_IFACE, {'Value': self.value}, [])

    def set_value(self, value):
        self.value = [dbus.Byte(ord(c)) for c in value]
        if self.notifying:
            self.PropertiesChanged(GATT_CHRC_IFACE, {'Value': self.value}, [])

class TestService(Service):
    TEST_SVC_UUID = '12345678-1234-5678-1234-56789abcdef0'
    def __init__(self, bus, index):
        Service.__init__(self, bus, index, self.TEST_SVC_UUID, True)
        self.add_characteristic(YoloCharacteristic(bus, 0, self))
        self.add_characteristic(TesseractCharacteristic(bus, 1, self))
        self.add_characteristic(ShutdownCharacteristic(bus, 2, self))

class YoloCharacteristic(Characteristic):
    YOLO_CHRC_UUID = '12345678-1234-5678-1234-56789abcdef1'
    def __init__(self, bus, index, service):
        Characteristic.__init__(
            self, bus, index,
            self.YOLO_CHRC_UUID,
            ['read', 'notify'],
            service)
        
        #self.value = [dbus.Byte(ord(c)) for c in 'Start']

class TesseractCharacteristic(Characteristic):
    TESSERACT_CHRC_UUID = '12345678-1234-5678-1234-56789abcdef2'
    def __init__(self, bus, index, service):
        Characteristic.__init__(
            self, bus, index,
            self.TESSERACT_CHRC_UUID,
            ['read', 'notify'],
            service)
        
        #self.value = [dbus.Byte(ord(c)) for c in 'Start']

class ShutdownCharacteristic(Characteristic):
    SHUTDOWN_CHRC_UUID = '12345678-1234-5678-1234-56789abcdef3'  

    def __init__(self, bus, index, service):
        Characteristic.__init__(
            self, bus, index,
            self.SHUTDOWN_CHRC_UUID,
            ['write'],
            service)
        self.value = []

    @dbus.service.method(GATT_CHRC_IFACE,
                         in_signature='aya{sv}',
                         out_signature='ay')
    def WriteValue(self, value, options):
        print('Shutdown command received, shutting down...')
        self.value = value
        # Encerra a aplicação GATT
        os.system('sudo systemctl stop bluetooth')
        # Desliga o sistema operacional
        os.system('sudo shutdown now')


def register_app_cb():
    print('GATT application registered')

def register_app_error_cb(mainloop, error):
    print('Failed to register application: ' + str(error))
    mainloop.quit()

def gatt_server_main(mainloop, bus, adapter_name):
    adapter = adapters.find_adapter(bus, GATT_MANAGER_IFACE, adapter_name)
    if not adapter:
        raise Exception('GattManager1 interface not found')
    service_manager = dbus.Interface(
        bus.get_object(BLUEZ_SERVICE_NAME, adapter),
        GATT_MANAGER_IFACE)
    app = Application(bus)
    print('Registering GATT application...')
    service_manager.RegisterApplication(app.get_path(), {},
                                        reply_handler=register_app_cb,
                                        error_handler=functools.partial(register_app_error_cb, mainloop))
    return app

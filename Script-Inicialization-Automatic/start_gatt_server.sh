#!/bin/bash
cd /root/

# Ativar o ambiente virtual
source venv/bin/activate

# Executar o servidor GATT
python3 gatt_server_executable.py

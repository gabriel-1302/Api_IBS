import pandas as pd
import requests
import random
import sys
import string

# Nombre del archivo de Excel
file_name = "Copia de CODIGOS_FESTIVAL_2025(1).xlsx"
# URL de la API
api_url = "http://127.0.0.1:8000/api/codigos/"

# --- Funciones para generar códigos ---
generated_codes = set()

def generate_unique_code(length=8):
    """Genera un código numérico único de 8 dígitos."""
    while True:
        # Generar un número entre 10000000 y 99999999
        code = str(random.randint(10_000_000, 99_999_999))
        if code not in generated_codes:
            generated_codes.add(code)
            return code

try:
    # Leer el archivo de Excel, usando la primera columna como índice y sin cabecera
    df = pd.read_excel(file_name, header=None, names=['index', 'id', 'nombre_completo'])

    print("Iniciando la inserción de datos en la base de datos...")

    # Iterar sobre cada fila del DataFrame
    for index, row in df.iterrows():
        # Omitir las filas de encabezado/sección (donde 'id' o 'nombre_completo' es NaN)
        if pd.isna(row['id']) or pd.isna(row['nombre_completo']):
            # Imprime el encabezado de sección para dar contexto
            if pd.notna(row['index']):
                print(f"\n--- Sección: {row['index']} ---")
            continue

        nombre = str(row['nombre_completo']).strip()
        
        # Generar un código único
        codigo_generado = generate_unique_code()

        # Preparar los datos para la API
        data_to_post = {
            "codigo": codigo_generado,
            "nombre_completo": nombre,
            "habilitado": True,
            "usado": False
        }

        try:
            # Realizar la solicitud POST a la API
            response = requests.post(api_url, json=data_to_post)
            
            # Verificar si la solicitud fue exitosa
            if response.status_code == 201:
                print(f"Éxito: Se insertó a '{nombre}' con el código '{codigo_generado}'.")
            else:
                # Imprimir un error si la API no devuelve 201 Created
                print(f"Error al insertar a '{nombre}'. Código de estado: {response.status_code}", file=sys.stderr)
                print(f"Respuesta de la API: {response.text}", file=sys.stderr)

        except requests.exceptions.RequestException as e:
            print(f"\nError de conexión: No se pudo conectar a la API en {api_url}", file=sys.stderr)
            print("Por favor, asegúrate de que el servidor de Django esté corriendo.", file=sys.stderr)
            sys.exit(1) # Salir del script si no se puede conectar a la API

except FileNotFoundError:
    print(f"Error: El archivo '{file_name}' no fue encontrado.", file=sys.stderr)
except Exception as e:
    print(f"Ocurrió un error al procesar el archivo: {e}", file=sys.stderr)

print("\nProceso de inserción completado.")
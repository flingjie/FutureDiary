import requests
import json
from pathlib import Path

class PinataIPFSUploader:
    def __init__(self, api_key, api_secret):
        self.api_key = api_key
        self.api_secret = api_secret
        self.base_url = "https://api.pinata.cloud"
        
    def upload_file(self, file_obj, filename):
        """
        Upload a file to IPFS via Pinata
        :param file_obj: File object or file-like object to upload
        :param filename: Name of the file
        :return: IPFS hash (CID) of the uploaded file
        """
        endpoint = f"{self.base_url}/pinning/pinFileToIPFS"
        
        headers = {
            'pinata_api_key': self.api_key,
            'pinata_secret_api_key': self.api_secret
        }
        
        try:
            files = {
                'file': (filename, file_obj)
            }
            
            response = requests.post(
                endpoint,
                headers=headers,
                files=files
            )
            
            if response.status_code == 200:
                return response.json()['IpfsHash']
            else:
                raise Exception(f"Upload failed: {response.text}")
                
        except Exception as e:
            raise Exception(f"Error uploading file: {str(e)}")

# Example usage

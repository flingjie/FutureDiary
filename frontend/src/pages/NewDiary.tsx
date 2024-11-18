import { useState } from 'react';
import { API_BASE_URL, API_SECRET_KEY, PACKAGE_ID } from '../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCurrentAccount, useSignAndExecuteTransaction} from '@mysten/dapp-kit';
import { Transaction } from "@mysten/sui/transactions";



const createAuthHeaders = async (secretKey: string): Promise<Record<string, string>> => {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const message = new TextEncoder().encode(timestamp);
  const key = new TextEncoder().encode(secretKey);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, message);
  const hashArray = Array.from(new Uint8Array(signature));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return {
    'X-Timestamp': timestamp,
    'X-Signature': hashHex
  };
};

export function NewDiary() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isUploadingToIPFS, setIsUploadingToIPFS] = useState(false);
  const [isCreatingNFT, setIsCreatingNFT] = useState(false);
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [formData, setFormData] = useState({
    date: '',
    title: '',
    content: '',
    image: null as File | string | null,
    ipfsUrl: '',
  });


  const uploadToIPFS = async (file: File | string) => {
    try {
      const formData = new FormData();
      if (typeof file === 'string') {
        // If file is a URL
        formData.append('file_url', file);
      } else {
        // If file is a File object
        formData.append('file', file);
      }

      const authHeaders = await createAuthHeaders(API_SECRET_KEY);
      const response = await fetch(`${API_BASE_URL}/upload-to-ipfs`, {
        method: 'POST',
        headers: {
          ...authHeaders
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload to IPFS');
      }

      const data = await response.json();
      return data.ipfs_url;
    } catch (error) {
      console.error('IPFS upload error:', error);
      throw new Error('Failed to upload to IPFS');
    }
  }

  const handleIPFSUpload = async () => {
    if (!formData.image) return;
    
    setIsUploadingToIPFS(true);
    try {
      const ipfsUrl = await uploadToIPFS(formData.image);
      setFormData(prev => ({
        ...prev,
        ipfsUrl
      }));
      console.log('IPFS URL:', ipfsUrl);
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      toast.error('Failed to upload to IPFS. Please try again.');
    } finally {
      setIsUploadingToIPFS(false);
    }
  };

  const handleCreateNFT = async () => {
    if (isCreatingNFT) return;
    setIsCreatingNFT(true);
   
    try {
      if (!account) {
        toast.error('Please connect your wallet first');
        return;
      }

      const metadata = {
        date: formData.date,
        title: formData.title,
        content: formData.content,
        ipfsUrl: formData.ipfsUrl
      };

      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::future_diary::create_diary`,
        arguments: [
          tx.pure.string(metadata.date),
          tx.pure.string(metadata.content),
          tx.pure.string(metadata.ipfsUrl),
        ],
      });

      signAndExecute(
        {
          transaction: tx,
          chain: account.chains[0]
        },
        {
          onSuccess: (result: any) => {
            console.log('executed transaction', result);
            toast.success('NFT created successfully!');
          },
          onError: (error: any) => {
            console.error('Error creating NFT:', error);
            toast.error('Failed to create NFT');
          }
        },
      );
    } catch (error) {
      console.error('Error creating NFT:', error);
      toast.error('Failed to create NFT');
    } finally {
      setIsCreatingNFT(false);
    }
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px 20px',
    }}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{
          zIndex: 9999,
          top: '80px'
        }}
      />
      
      <h1 style={{
        fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
        textAlign: 'center',
        marginBottom: '40px',
        background: 'linear-gradient(-45deg, #00ffff, #ff00ff)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontFamily: '"Orbitron", sans-serif',
      }}>
        QUANTUM STORY GENERATOR
      </h1>

      <form>
        {/* Date Field */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label htmlFor="date" style={{
            color: '#00ffff',
            fontFamily: '"Orbitron", sans-serif',
            fontSize: '0.9rem',
          }}>
            SELECT FUTURE DATE
          </label>
          <input
            type="date"
            id="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(0, 255, 255, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              color: '#fff',
              fontFamily: '"Rajdhani", sans-serif',
              outline: 'none',
              transition: 'all 0.3s ease',
            }}
            required
            placeholder="When will this story happen?"
          />
        </div>

        {/* Title Field */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label htmlFor="title" style={{
            color: '#00ffff',
            fontFamily: '"Orbitron", sans-serif',
            fontSize: '0.9rem',
          }}>
            NAME YOUR STORY
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(0, 255, 255, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              color: '#fff',
              fontFamily: '"Rajdhani", sans-serif',
              outline: 'none',
              transition: 'all 0.3s ease',
            }}
            placeholder="Give your future story a title"
            required
          />
        </div>

        {/* Content Field */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label htmlFor="content" style={{
            color: '#00ffff',
            fontFamily: '"Orbitron", sans-serif',
            fontSize: '0.9rem',
          }}>
            THE STORY DETAILS
          </label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(0, 255, 255, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              color: '#fff',
              fontFamily: '"Rajdhani", sans-serif',
              minHeight: '150px',
              resize: 'vertical',
              outline: 'none',
              transition: 'all 0.3s ease',
            }}
            placeholder="AI can generate the story, or you can write your own..."
            required
          />
        </div>
        {/* Generate Button */}
        <button
          type="button"
          // disabled={isGenerating}
          disabled={true}
          onClick={async () => {
            if (!formData.title.trim() || !formData.date) {
              toast.error('Please fill in both title and date fields before generating');
              return;
            }
            setIsGenerating(true);
            try {
              const authHeaders = await createAuthHeaders(API_SECRET_KEY);
              const response = await fetch(`${API_BASE_URL}/generate-text`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  ...authHeaders
                },
                body: JSON.stringify({
                  title: formData.title,
                  future_date: formData.date
                })
              });
              
              if (!response.ok) {
                throw new Error('Failed to generate content');
              }

              const data = await response.json();
  
              setFormData(prev => ({
                ...prev,
                content: data.content
              }));
            } catch (error) {
              console.error('Error generating content:', error);
              toast.error('Failed to generate content. Please try again.');
            } finally {
              setIsGenerating(false);
            }
          }}
          style={{
            width: '100%',
            background: 'rgba(0, 255, 255, 0.1)',
            border: '2px solid rgba(0, 255, 255, 0.5)',
            borderRadius: '8px',
            padding: '14px',
            color: '#00ffff',
            fontFamily: '"Orbitron", sans-serif',
            fontSize: '0.9rem',
            cursor: isGenerating ? 'not-allowed' : 'pointer',
            opacity: isGenerating ? 0.7 : 1,
            transition: 'all 0.3s ease',
          }}
        >
          {isGenerating ? 'Generating...' : 'Generate Story with AI'}
        </button>

        {/* Image Upload Field */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label htmlFor="image" style={{
            color: '#00ffff',
            fontFamily: '"Orbitron", sans-serif',
            fontSize: '0.9rem',
          }}>
            ADD STORY IMAGE
          </label>
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => document.getElementById('image')?.click()}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(0, 255, 255, 0.3)',
                borderRadius: '8px',
                padding: '12px',
                color: '#fff',
                fontFamily: '"Rajdhani", sans-serif',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              CHOOSE AN IMAGE
            </button>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                opacity: 0,
                width: '100%',
                height: '100%',
                cursor: 'pointer',
              }}
            />
          </div>
          
          {formData.image && (
            <span style={{
              fontSize: '0.8rem',
              color: 'rgba(255, 255, 255, 0.6)',
              fontFamily: '"Rajdhani", sans-serif',
              marginTop: '4px'
            }}>
              {/* @ts-ignore */}
              Selected file: {formData.image.name}
            </span>
          )}
          <span style={{
            fontSize: '0.8rem',
            color: 'rgba(255, 255, 255, 0.6)',
            fontFamily: '"Rajdhani", sans-serif',
            marginTop: '4px'
          }}>
            Add an image for your future story
          </span>
        </div>
        {/* Buttons Container */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          marginTop: '24px',
        }}>

          {/* Generate Image Button and IPFS Upload Button */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              // disabled={isGeneratingImage}
              disabled={true}
              onClick={async () => {
                if (!formData.content) {
                  toast.error('Please enter some content first!');
                  return;
                }

                setIsGeneratingImage(true);
                try {
                  const authHeaders = await createAuthHeaders(API_SECRET_KEY);
                  
                  const response = await fetch(`${API_BASE_URL}/generate-image`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      ...authHeaders
                    },
                    body: JSON.stringify({
                      content: formData.content
                    })
                  });

                  if (!response.ok) {
                    throw new Error('Failed to generate image');
                  }

                  const data = await response.json();
                  setFormData(prev => ({
                    ...prev,
                    image: data.image_url
                  }));
                } catch (error) {
                  console.error('Error generating image:', error);
                  toast.error('Failed to generate image. Please try again.');
                } finally {
                  setIsGeneratingImage(false);
                }
              }}
              style={{
                flex: 1,
                background: 'rgba(0, 255, 255, 0.1)',
                border: '2px solid rgba(0, 255, 255, 0.5)',
                borderRadius: '8px',
                padding: '14px',
                color: '#00ffff',
                fontFamily: '"Orbitron", sans-serif',
                fontSize: '0.9rem',
                cursor: isGeneratingImage ? 'not-allowed' : 'pointer',
                opacity: isGeneratingImage ? 0.7 : 1,
                transition: 'all 0.3s ease',
              }}
            >
              {isGeneratingImage ? 'Generating Image...' : 'GENERATE AI IMAGE'}
            </button>

            {/* New IPFS Upload Button */}
            <button
              type="button"
              // disabled={isUploadingToIPFS || !formData.image}
              disabled={true}
              onClick={handleIPFSUpload}
              style={{
                flex: 1,
                background: 'rgba(255, 0, 255, 0.1)',
                border: '2px solid rgba(255, 0, 255, 0.5)',
                borderRadius: '8px',
                padding: '14px',
                color: '#ff00ff',
                fontFamily: '"Orbitron", sans-serif',
                fontSize: '0.9rem',
                cursor: (!formData.image || isUploadingToIPFS) ? 'not-allowed' : 'pointer',
                opacity: (!formData.image || isUploadingToIPFS) ? 0.7 : 1,
                transition: 'all 0.3s ease',
              }}
            >
              {isUploadingToIPFS ? 'Uploading...' : 'UPLOAD TO IPFS'}
            </button>
          </div>

          {formData.image && (
            <div style={{
              marginTop: '12px',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid rgba(0, 255, 255, 0.3)',
            }}>
              <img
                src={typeof formData.image === 'string' ? formData.image : URL.createObjectURL(formData.image)}
                alt="Preview"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
            </div>
          )}
          {/* Submit Button */}
          <button
            type="button" // Changed from "submit" to "button"
            onClick={(e) => {
              e.preventDefault(); // Prevent form submission
              handleCreateNFT();
            }}
            // disabled={isCreatingNFT}
            disabled={true}
            style={{
              width: '100%',
              background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
              border: 'none',
              borderRadius: '25px',
              padding: '18px',
              color: '#fff',
              fontFamily: '"Orbitron", sans-serif',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: isCreatingNFT ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 0 20px rgba(0, 255, 255, 0.2)',
              opacity: isCreatingNFT ? 0.7 : 1,
            }}
          >
            {isCreatingNFT ? 'CREATING STORY...' : 'CREATE FUTURE STORY'}
          </button>
        </div>
      </form>
    </div>
  );
} 

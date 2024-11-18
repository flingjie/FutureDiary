import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { NewDiary } from "./pages/NewDiary";
import { MyDiary } from "./pages/MyDiary";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <div style={{
        background: 'linear-gradient(to bottom, #0f0c29, #302b63, #24243e)',
        minHeight: '100vh',
        color: '#fff'
      }}>
        <Flex
          position="sticky"
          top="0"
          px="4"
          py="3"
          justify="between"
          align="center"
          style={{
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            zIndex: 1000
          }}
        >
          <Flex 
            align="center" 
            gap="6" 
            style={{ flex: 1 }}
          >
            <Heading size={{ initial: '5', sm: '6' }} style={{ 
              background: 'linear-gradient(-45deg, #00ffff, #ff00ff, #00ffff, #ff00ff)',
              backgroundSize: '300% 300%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 20px rgba(0,255,255,0.3)',
              fontWeight: 'bold',
              letterSpacing: '1px',
              animation: 'gradient 5s ease infinite',
              position: 'relative',
              padding: '0 4px',
              // @ts-ignore
              '@keyframes gradient': {
                '0%': {
                  backgroundPosition: '0% 50%'
                },
                '50%': {
                  backgroundPosition: '100% 50%'
                },
                '100%': {
                  backgroundPosition: '0% 50%'
                }
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '0',
                left: '-2px',
                right: '-2px',
                bottom: '0',
                background: 'linear-gradient(-45deg, #00ffff, #ff00ff)',
                filter: 'blur(20px)',
                opacity: '0.3',
                zIndex: '-1',
                animation: 'pulse 2s ease-in-out infinite'
              },
              '@keyframes pulse': {
                '0%': {
                  opacity: '0.3'
                },
                '50%': {
                  opacity: '0.5'
                },
                '100%': {
                  opacity: '0.3'
                }
              }
            }}>
              Future Diary
            </Heading>
            
            <nav style={{ 
              display: 'flex', 
              gap: '16px',
              // @ts-ignore
              '@media (max-width: 640px)': {
                display: 'none' // 在移动端隐藏横向导航
              }
            }}>
              <Link to="/" style={{ 
                color: '#fff',
                textDecoration: 'none',
                padding: '6px 16px',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '0.95rem',
                fontWeight: 500,
                letterSpacing: '0.5px'
              }}>Home</Link>
              <Link to="/new" style={{ 
                color: '#fff',
                textDecoration: 'none',
                padding: '6px 16px',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '0.95rem',
                fontWeight: 500,
                letterSpacing: '0.5px'
              }}>New Diary</Link>
              <Link to="/my" style={{ 
                color: '#fff',
                textDecoration: 'none',
                padding: '6px 16px',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '0.95rem',
                fontWeight: 500,
                letterSpacing: '0.5px'
              }}>My Diary</Link>
            </nav>
          </Flex>

          <Box>
            <ConnectButton />
          </Box>

          {/* 移动端的导航菜单 */}
          <Box style={{ 
            display: 'none',
            // @ts-ignore
            '@media (max-width: 640px)': {
              display: 'flex',
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '12px',
              background: 'rgba(15, 12, 41, 0.95)',
              backdropFilter: 'blur(10px)',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              justifyContent: 'center',
              gap: '16px',
              zIndex: 1000
            }
          }}>
            <nav style={{ 
              display: 'flex', 
              gap: '16px',
              justifyContent: 'center'
            }}>
              {/* 移动端导航链接使用相同的样式 */}
              <Link to="/" style={{ 
                color: '#fff',
                textDecoration: 'none',
                padding: '6px 16px',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '0.95rem',
                fontWeight: 500,
                letterSpacing: '0.5px'
              }}>Home</Link>
              <Link to="/new" style={{ 
                color: '#fff',
                textDecoration: 'none',
                padding: '6px 16px',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '0.95rem',
                fontWeight: 500,
                letterSpacing: '0.5px'
              }}>New Diary</Link>
              <Link to="/my" style={{ 
                color: '#fff',
                textDecoration: 'none',
                padding: '6px 16px',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '0.95rem',
                fontWeight: 500,
                letterSpacing: '0.5px'
              }}>My Diary</Link>
            </nav>
          </Box>
        </Flex>

        <Container p={{ initial: '2', sm: '4' }}>
          <Container
            mt="5"
            pt="2"
            px={{ initial: '2', sm: '4' }}
            style={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '15px',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              minHeight: 500,
              width: '100%',
              maxWidth: '100%',
              overflow: 'auto'
            }}
          >
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/new" element={<NewDiary />} />
              <Route path="/my" element={<MyDiary />} />
            </Routes>
          </Container>

          {/* Add Footer */}
          <Box
            mt="4"
            pb="4"
            style={{
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.9rem',
              // Ensure footer doesn't overlap with mobile navigation
              marginBottom: window.innerWidth <= 640 ? '60px' : '20px'
            }}
          >
            <a
              href="https://github.com/flingjie/FutureDiary"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'inherit',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
            >
              <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              View Source on GitHub
            </a>
          </Box>
        </Container>
      </div>
    </BrowserRouter>
  );
}

export default App;

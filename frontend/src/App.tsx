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
        </Container>
      </div>
    </BrowserRouter>
  );
}

export default App;

import { Box } from "@mui/material";
import ChatHistory from "../components/ChatHistory";
import ChatRoom from "../components/ChatRoom";

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
  },
  sidebar: {
    width: "30%",
    borderRight: 1,
    borderColor: "divider",
    bgcolor: "background.paper",
  },
  content: {
    width: "70%",
    bgcolor: "background.paper",
  },
};

function MainPage() {
  return (
    <Box sx={styles.container}>
      {/* 좌측 채팅 히스토리 */}
      <Box sx={styles.sidebar}>
        <ChatHistory />
      </Box>

      {/* 우측 채팅 영역 */}
      <Box sx={styles.content}>
        <ChatRoom />
      </Box>
    </Box>
  );
}

export default MainPage;

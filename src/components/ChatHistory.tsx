import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useChatStore } from "../store/chatStore";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  newChatButton: {
    m: 2,
  },
  list: {
    flex: 1,
    overflowY: "auto",
  },
  listItem: (isSelected: boolean) => ({
    bgcolor: isSelected ? "action.selected" : "transparent",
    "&:hover": {
      bgcolor: "action.hover",
    },
  }),
  messageDate: {
    color: "text.secondary",
    fontSize: "0.875rem",
  },
  messageContent: {
    mt: 0.5,
    color: "text.primary",
  },
};

export default function ChatHistory() {
  const chatHistories = useChatStore((state) => state.chatHistories);
  const currentUuid = useChatStore((state) => state.currentUuid);
  const selectChat = useChatStore((state) => state.selectChat);
  const createNewChat = useChatStore((state) => state.createNewChat);

  return (
    <Box sx={styles.container}>
      <Button
        variant="contained"
        onClick={createNewChat}
        sx={styles.newChatButton}
      >
        새로운 대화 시작
      </Button>

      <List sx={styles.list}>
        {chatHistories.map((chat) => (
          <ListItem key={chat.uuid} disablePadding>
            <ListItemButton
              onClick={() => selectChat(chat.uuid)}
              sx={styles.listItem(chat.uuid === currentUuid)}
            >
              <Box sx={{ width: "100%" }}>
                <Typography sx={styles.messageDate}>
                  {chat.firstMessage
                    ? format(new Date(chat.firstMessage.timestamp), "PPP p", {
                        locale: ko,
                      })
                    : "새로운 대화"}
                </Typography>
                <Typography sx={styles.messageContent}>
                  {chat.firstMessage?.content || "대화를 시작해보세요"}
                </Typography>
              </Box>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

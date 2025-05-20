import { useEffect, useRef, useState } from "react";
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Chip,
} from "@mui/material";
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
} from "@mui/icons-material";
import { useChatStore } from "../store/chatStore";
import { uploadFile } from "../api/file";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  messageList: {
    flex: 1,
    overflowY: "auto",
    p: 2,
  },
  messageItem: (isHuman: boolean) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: isHuman ? "flex-end" : "flex-start",
    mb: 2,
  }),
  messageBubble: (isHuman: boolean) => ({
    maxWidth: "70%",
    p: 2,
    bgcolor: isHuman ? "primary.main" : "grey.200",
    color: isHuman ? "white" : "text.primary",
    borderRadius: 2,
  }),
  timestamp: {
    mt: 0.5,
    color: "text.secondary",
  },
  inputContainer: {
    p: 2,
    display: "flex",
    flexDirection: "column",
    gap: 1,
    borderTop: 1,
    borderColor: "divider",
  },
  inputRow: {
    display: "flex",
    alignItems: "center",
    gap: 1,
  },
  fileContainer: {
    display: "flex",
    gap: 1,
    p: 1,
    borderBottom: 1,
    borderColor: "divider",
  },
};

export default function ChatRoom() {
  const currentUuid = useChatStore((state) => state.currentUuid);
  const chats = useChatStore((state) => state.chats);
  const addMessage = useChatStore((state) => state.addMessage);
  const isLoading = useChatStore((state) => state.isLoading);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const currentChat = currentUuid ? chats[currentUuid] : null;

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages]);

  useEffect(() => {
    setIsFileUploaded(false);
    setUploadedFileName(null);
  }, [currentUuid]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const content = formData.get("message") as string;

    if (!content.trim()) return;

    await addMessage(content, "human");
    form.reset();
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !currentUuid) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("filename", file.name);
      formData.append("uuid", currentUuid);

      const result = await uploadFile(file);
      await addMessage(result.message, "ai");

      setIsFileUploaded(true);
      setUploadedFileName(file.name);
    } catch (error) {
      console.error("Failed to upload file:", error);
      await addMessage(
        `파일 업로드 실패: ${error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다."}`,
        "ai"
      );
      setIsFileUploaded(false);
      setUploadedFileName(null);
    }
  };

  const handleRemoveFile = () => {
    setIsFileUploaded(false);
    setUploadedFileName(null);
  };

  if (!currentUuid || !currentChat) {
    return (
      <Box
        sx={{
          flex: 1,
          height: "30vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography color="text.secondary" variant="h5">
          채팅방을 선택하거나 새로운 대화를 시작하세요
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={styles.container}>
      <Box sx={styles.messageList}>
        {currentChat.messages.map((message) => (
          <Box
            key={message.id}
            sx={styles.messageItem(message.role === "human")}
          >
            <Paper sx={styles.messageBubble(message.role === "human")}>
              <Typography>{message.content}</Typography>
            </Paper>
            <Typography variant="caption" sx={styles.timestamp}>
              {new Date(message.timestamp).toLocaleTimeString()}
            </Typography>
          </Box>
        ))}
        <div ref={messageEndRef} />
      </Box>

      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={styles.inputContainer}
        elevation={0}
      >
        {uploadedFileName && (
          <Chip
            label={uploadedFileName}
            onDelete={handleRemoveFile}
            color="primary"
            variant="outlined"
            size="small"
            sx={{
              width: "15vw",
            }}
          />
        )}
        <Box sx={styles.inputRow}>
          <input
            type="file"
            id="file-upload"
            style={{ display: "none" }}
            onChange={handleFileUpload}
            disabled={isFileUploaded}
          />
          <label htmlFor="file-upload">
            <IconButton
              component="span"
              color="primary"
              disabled={isLoading || isFileUploaded}
              sx={{
                opacity: isFileUploaded ? 0.5 : 1,
                cursor: isFileUploaded ? "not-allowed" : "pointer",
              }}
            >
              <AttachFileIcon />
            </IconButton>
          </label>
          <TextField
            fullWidth
            name="message"
            placeholder="메시지를 입력하세요."
            disabled={isLoading}
            size="small"
          />
          <IconButton type="submit" color="primary" disabled={isLoading}>
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
}

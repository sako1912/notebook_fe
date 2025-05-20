import type { SxProps, Theme } from "@mui/material";

export const flexStyles = {
  fullHeight: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  row: {
    display: "flex",
    alignItems: "center",
  },
  column: {
    display: "flex",
    flexDirection: "column",
  },
} as const;

export const containerStyles = {
  mainContainer: {
    display: "flex",
    height: "100vh",
    bgcolor: "background.default",
  },
  leftSidebar: {
    width: 300,
    borderRight: 1,
    borderColor: "divider",
    bgcolor: "background.paper",
  },
  rightContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    width: "100vh",
    bgcolor: "background.paper",
  },
} as const;

export const chatStyles = {
  messageContainer: {
    flex: 1,
    overflow: "auto",
    p: 2,
  },
  messageItem: (isUser: boolean): SxProps<Theme> => ({
    display: "flex",
    justifyContent: isUser ? "flex-end" : "flex-start",
    mb: 2,
  }),
  messageBubble: (isUser: boolean): SxProps<Theme> => ({
    p: 2,
    maxWidth: "70%",
    bgcolor: isUser ? "primary.main" : "grey.100",
    color: isUser ? "white" : "text.primary",
  }),
  timestamp: {
    mt: 1,
    opacity: 0.8,
  },
} as const;

export const inputStyles = {
  searchContainer: {
    p: "2px 4px",
    display: "flex",
    alignItems: "center",
  },
  searchInput: {
    ml: 1,
    flex: 1,
  },
  messageInputContainer: {
    p: 2,
    borderTop: 1,
    borderColor: "divider",
    display: "flex",
    alignItems: "center",
    gap: 2,
  },
  messageInput: {
    flex: 1,
  },
  sendButton: {
    alignSelf: "flex-end",
  },
} as const;

export const listStyles = {
  historyList: {
    flex: 1,
    overflow: "auto",
  },
  dateHeader: {
    px: 2,
    py: 1,
    display: "block",
    bgcolor: "background.default",
  },
} as const;

import { Button, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Home() {
  const [id, setId] = useState("");
  const router = useRouter();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (id) router.push("/" + id);
      }}
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h3">
        Welcome to our Crowdsourced Image Annotation Project
      </Typography>
      <Typography variant="h6" style={{ marginTop: 24 }}>
        To use the app, please enter your worker ID and click
        &quot;Continue&quot;
      </Typography>
      <TextField
        label="Worker ID"
        style={{ marginTop: 24 }}
        sx={{ width: 400 }}
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <Button type="submit" style={{ marginTop: 24 }} variant="contained">
        Continue
      </Button>
    </form>
  );
}

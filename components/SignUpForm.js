import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useCallback, useEffect, useMemo, useState } from "react";
import Parse from "parse";
import { useSnackbar } from "notistack";
import { userAtom } from "../recoil/app";
import { useSetRecoilState } from "recoil";

const SignUpForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const setCurrentUser = useSetRecoilState(userAtom);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState({
    first: false,
    confirm: false,
  });

  const signUp = useCallback(() => {
    if (!email || !password || !confirm) {
      enqueueSnackbar("Please fill all of the fields", { variant: "warning" });
      return;
    }

    if (password !== confirm) {
      enqueueSnackbar("Passwords do not match", { variant: "warning" });
      return;
    }

    setLoading(true);

    const user = new Parse.User();
    user.set("username", email);
    user.set("email", email);
    user.set("password", password);

    user
      .signUp()
      .then((user) => {
        setCurrentUser(user);
      })
      .catch((ex) => {
        enqueueSnackbar(ex.message, { variant: "error" });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [confirm, email, enqueueSnackbar, password, setCurrentUser]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        type={showPassword.first ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => {
                  setShowPassword((prev) => ({
                    ...prev,
                    first: !prev.first,
                  }));
                }}
                edge="end"
              >
                {showPassword.first ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        label="Confirm Password"
        type={showPassword.confirm ? "text" : "password"}
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => {
                  setShowPassword((prev) => ({
                    ...prev,
                    confirm: !prev.confirm,
                  }));
                }}
                edge="end"
              >
                {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <LoadingButton loading={loading} onClick={signUp} variant="contained">
        Sign Up
      </LoadingButton>
    </div>
  );
};

export default SignUpForm;

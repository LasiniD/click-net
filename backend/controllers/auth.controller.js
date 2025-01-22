export const signup = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    return res.status(201).json({ user });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};  

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    if (!user) {
      return res.status(401).json({ error: "Login failed! Check authentication credentials" });
    }
    const token = await user.generateAuthToken();
    res.cookie("token", token, { httpOnly: true });
    return res.status(200).json({ user, token });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }   
};

export const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token;
    });
    await req.user.save();
    return res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
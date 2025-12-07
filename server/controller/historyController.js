let history = []; // simple in-memory storage for hackathon, can upgrade to MongoDB

export const addHistory = (req, res) => {
  const { prompt, json, imageUrl } = req.body;

  const entry = {
    id: history.length + 1,
    prompt,
    json,
    imageUrl,
    createdAt: new Date()
  };

  history.push(entry);

  res.json({ success: true, entry });
};

export const getHistory = (req, res) => {
  res.json({ success: true, history });
};

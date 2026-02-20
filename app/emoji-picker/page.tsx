"use client";
import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

interface Emoji { e: string; n: string; k: string[]; }

const CATEGORIES: Record<string, Emoji[]> = {
  "Smileys & People": [
    { e: "😀", n: "Grinning Face", k: ["smile", "happy"] },
    { e: "😃", n: "Grinning Face with Big Eyes", k: ["happy", "joy"] },
    { e: "😄", n: "Grinning Face with Smiling Eyes", k: ["happy", "joy"] },
    { e: "😁", n: "Beaming Face", k: ["happy", "grin"] },
    { e: "😆", n: "Grinning Squinting Face", k: ["laugh", "happy"] },
    { e: "😅", n: "Grinning Face with Sweat", k: ["relief", "sweat"] },
    { e: "🤣", n: "Rolling on Floor Laughing", k: ["lol", "rofl"] },
    { e: "😂", n: "Face with Tears of Joy", k: ["laugh", "cry"] },
    { e: "🙂", n: "Slightly Smiling", k: ["smile"] },
    { e: "😊", n: "Smiling with Eyes", k: ["blush", "happy"] },
    { e: "😇", n: "Smiling with Halo", k: ["angel", "innocent"] },
    { e: "🥰", n: "Smiling with Hearts", k: ["love", "hearts"] },
    { e: "😍", n: "Heart Eyes", k: ["love", "crush"] },
    { e: "🤩", n: "Star-Struck", k: ["stars", "wow"] },
    { e: "😘", n: "Face Blowing Kiss", k: ["kiss", "love"] },
    { e: "😜", n: "Winking with Tongue", k: ["playful", "silly"] },
    { e: "🤔", n: "Thinking Face", k: ["think", "hmm"] },
    { e: "🤗", n: "Hugging Face", k: ["hug", "warm"] },
    { e: "🤭", n: "Face with Hand Over Mouth", k: ["oops", "giggle"] },
    { e: "🤫", n: "Shushing Face", k: ["quiet", "secret"] },
    { e: "😴", n: "Sleeping Face", k: ["sleep", "zzz"] },
    { e: "😎", n: "Smiling with Sunglasses", k: ["cool", "sunglasses"] },
    { e: "🤓", n: "Nerd Face", k: ["nerd", "geek"] },
    { e: "😤", n: "Face with Steam", k: ["angry", "frustrated"] },
    { e: "😢", n: "Crying Face", k: ["sad", "cry"] },
    { e: "😭", n: "Loudly Crying", k: ["cry", "sob"] },
    { e: "😱", n: "Screaming", k: ["scared", "shock"] },
    { e: "🥳", n: "Partying Face", k: ["party", "celebrate"] },
    { e: "😷", n: "Face with Mask", k: ["sick", "mask"] },
    { e: "🤮", n: "Vomiting", k: ["sick", "puke"] },
    { e: "👋", n: "Waving Hand", k: ["wave", "hello", "bye"] },
    { e: "👍", n: "Thumbs Up", k: ["like", "approve", "ok"] },
    { e: "👎", n: "Thumbs Down", k: ["dislike", "bad"] },
    { e: "👏", n: "Clapping Hands", k: ["clap", "bravo"] },
    { e: "🙌", n: "Raising Hands", k: ["celebrate", "hooray"] },
    { e: "🤝", n: "Handshake", k: ["deal", "agree"] },
    { e: "✌️", n: "Victory Hand", k: ["peace", "victory"] },
    { e: "🤞", n: "Crossed Fingers", k: ["luck", "hope"] },
    { e: "💪", n: "Flexed Biceps", k: ["strong", "muscle"] },
    { e: "🙏", n: "Folded Hands", k: ["pray", "please", "thank"] },
  ],
  "Hearts & Symbols": [
    { e: "❤️", n: "Red Heart", k: ["love", "heart"] },
    { e: "🧡", n: "Orange Heart", k: ["heart"] },
    { e: "💛", n: "Yellow Heart", k: ["heart"] },
    { e: "💚", n: "Green Heart", k: ["heart"] },
    { e: "💙", n: "Blue Heart", k: ["heart"] },
    { e: "💜", n: "Purple Heart", k: ["heart"] },
    { e: "🖤", n: "Black Heart", k: ["heart", "dark"] },
    { e: "💔", n: "Broken Heart", k: ["heartbreak", "sad"] },
    { e: "💯", n: "Hundred Points", k: ["perfect", "score"] },
    { e: "💢", n: "Anger Symbol", k: ["angry"] },
    { e: "💥", n: "Collision", k: ["boom", "crash"] },
    { e: "💫", n: "Dizzy", k: ["star", "dizzy"] },
    { e: "💬", n: "Speech Balloon", k: ["chat", "message"] },
    { e: "✅", n: "Check Mark", k: ["done", "yes", "success"] },
    { e: "❌", n: "Cross Mark", k: ["no", "wrong", "error"] },
    { e: "⭐", n: "Star", k: ["star", "favorite"] },
    { e: "🔥", n: "Fire", k: ["hot", "fire", "lit"] },
    { e: "✨", n: "Sparkles", k: ["magic", "shine"] },
    { e: "⚡", n: "Lightning", k: ["electricity", "fast"] },
    { e: "🎯", n: "Bullseye", k: ["target", "goal"] },
  ],
  "Nature & Animals": [
    { e: "🐶", n: "Dog Face", k: ["dog", "puppy", "pet"] },
    { e: "🐱", n: "Cat Face", k: ["cat", "kitten", "pet"] },
    { e: "🐭", n: "Mouse Face", k: ["mouse"] },
    { e: "🐰", n: "Rabbit Face", k: ["rabbit", "bunny"] },
    { e: "🦊", n: "Fox Face", k: ["fox"] },
    { e: "🐻", n: "Bear", k: ["bear"] },
    { e: "🐼", n: "Panda", k: ["panda"] },
    { e: "🐨", n: "Koala", k: ["koala"] },
    { e: "🦁", n: "Lion", k: ["lion", "king"] },
    { e: "🐸", n: "Frog", k: ["frog"] },
    { e: "🌸", n: "Cherry Blossom", k: ["flower", "spring"] },
    { e: "🌹", n: "Rose", k: ["flower", "love"] },
    { e: "🌻", n: "Sunflower", k: ["flower", "sun"] },
    { e: "🌳", n: "Tree", k: ["tree", "nature"] },
    { e: "🌈", n: "Rainbow", k: ["rainbow", "color"] },
    { e: "☀️", n: "Sun", k: ["sun", "weather", "hot"] },
    { e: "🌙", n: "Moon", k: ["moon", "night"] },
    { e: "⛈️", n: "Thunderstorm", k: ["storm", "weather"] },
    { e: "❄️", n: "Snowflake", k: ["snow", "cold", "winter"] },
    { e: "🌊", n: "Wave", k: ["ocean", "sea", "water"] },
  ],
  "Food & Drink": [
    { e: "🍎", n: "Red Apple", k: ["apple", "fruit"] },
    { e: "🍕", n: "Pizza", k: ["pizza", "food"] },
    { e: "🍔", n: "Hamburger", k: ["burger", "food"] },
    { e: "🌮", n: "Taco", k: ["taco", "food"] },
    { e: "🍜", n: "Steaming Bowl", k: ["ramen", "noodles", "soup"] },
    { e: "🍣", n: "Sushi", k: ["sushi", "japanese"] },
    { e: "🍦", n: "Soft Ice Cream", k: ["icecream", "dessert"] },
    { e: "🍩", n: "Doughnut", k: ["donut", "snack"] },
    { e: "🎂", n: "Birthday Cake", k: ["cake", "birthday"] },
    { e: "☕", n: "Hot Beverage", k: ["coffee", "tea", "hot"] },
    { e: "🍺", n: "Beer Mug", k: ["beer", "drink"] },
    { e: "🍷", n: "Wine Glass", k: ["wine", "drink"] },
    { e: "🥤", n: "Cup with Straw", k: ["drink", "soda"] },
    { e: "🧃", n: "Beverage Box", k: ["juice"] },
    { e: "🍿", n: "Popcorn", k: ["popcorn", "movie"] },
  ],
  "Objects & Tech": [
    { e: "💻", n: "Laptop", k: ["computer", "laptop", "code"] },
    { e: "⌨️", n: "Keyboard", k: ["keyboard", "type"] },
    { e: "🖥️", n: "Desktop", k: ["computer", "monitor"] },
    { e: "📱", n: "Mobile Phone", k: ["phone", "mobile"] },
    { e: "📧", n: "E-Mail", k: ["email", "mail"] },
    { e: "📁", n: "File Folder", k: ["folder", "file"] },
    { e: "📊", n: "Bar Chart", k: ["chart", "graph", "data"] },
    { e: "🔧", n: "Wrench", k: ["tool", "fix"] },
    { e: "⚙️", n: "Gear", k: ["settings", "config"] },
    { e: "🔒", n: "Locked", k: ["lock", "secure"] },
    { e: "🔑", n: "Key", k: ["key", "password"] },
    { e: "🔔", n: "Bell", k: ["notification", "alert"] },
    { e: "📦", n: "Package", k: ["box", "package", "ship"] },
    { e: "🚀", n: "Rocket", k: ["rocket", "launch", "fast"] },
    { e: "💡", n: "Light Bulb", k: ["idea", "light"] },
    { e: "🔍", n: "Magnifying Glass", k: ["search", "find"] },
    { e: "📌", n: "Pushpin", k: ["pin", "location"] },
    { e: "📝", n: "Memo", k: ["note", "write"] },
    { e: "🗑️", n: "Wastebasket", k: ["trash", "delete"] },
    { e: "🏷️", n: "Label", k: ["tag", "label"] },
  ],
};

export default function EmojiPickerPage() {
  const { copy, Toast } = useCopyToast();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const allEmojis = useMemo(() => {
    const all: (Emoji & { cat: string })[] = [];
    for (const [cat, emojis] of Object.entries(CATEGORIES)) {
      for (const em of emojis) all.push({ ...em, cat });
    }
    return all;
  }, []);

  const filtered = useMemo(() => {
    return allEmojis.filter((em) => {
      const matchSearch = !search || em.n.toLowerCase().includes(search.toLowerCase()) || em.k.some((k) => k.includes(search.toLowerCase()));
      const matchCat = selectedCategory === "all" || em.cat === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [search, selectedCategory, allEmojis]);

  return (
    <main className="tool-container">
      <h1 className="tool-title">Emoji Picker</h1>
      <p className="tool-desc">Search and browse emojis by name or category. Click any emoji to copy it to your clipboard.</p>

      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <input
          type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search emojis..."
          style={{
            flex: 1, minWidth: 200, background: "var(--surface)", color: "var(--foreground)",
            border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px", fontSize: 14,
          }}
        />
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)",
            borderRadius: 6, padding: "8px 10px", fontSize: 14,
          }}>
          <option value="all">All ({allEmojis.length})</option>
          {Object.keys(CATEGORIES).map((cat) => (
            <option key={cat} value={cat}>{cat} ({CATEGORIES[cat].length})</option>
          ))}
        </select>
      </div>

      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8 }}>{filtered.length} emoji{filtered.length !== 1 ? "s" : ""} — click to copy</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(56px, 1fr))", gap: 4 }}>
        {filtered.map((em, i) => (
          <button key={i} onClick={() => copy(em.e)} title={`${em.n}\nClick to copy`}
            style={{
              fontSize: 28, padding: "8px 4px", background: "var(--surface)",
              border: "1px solid var(--border)", borderRadius: 8, cursor: "pointer",
              transition: "transform 0.1s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {em.e}
          </button>
        ))}
      </div>

      <Toast />
    </main>
  );
}

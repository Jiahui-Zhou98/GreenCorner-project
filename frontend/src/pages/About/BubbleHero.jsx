import bubble1 from "../../assets/about/bubble1.png";
import bubble2 from "../../assets/about/bubble2.png";
import bubble3 from "../../assets/about/bubble3.png";
import bubble4 from "../../assets/about/bubble4.png";
import bubble5 from "../../assets/about/bubble5.png";
import "./BubbleHero.css";

const BUBBLES = [
  {
    src: bubble1,
    alt: "plant 1",
    size: 210,
    top: 40,
    left: "3%",
    duration: 4.2,
    delay: 0,
  },
  {
    src: bubble2,
    alt: "plant 2",
    size: 270,
    top: 55,
    left: "20%",
    duration: 5.1,
    delay: 0.7,
  },
  {
    src: bubble3,
    alt: "plant 3",
    size: 190,
    top: 18,
    left: "42%",
    duration: 3.7,
    delay: 1.4,
  },
  {
    src: bubble4,
    alt: "plant 4",
    size: 255,
    top: 75,
    left: "59%",
    duration: 4.8,
    delay: 0.4,
  },
  {
    src: bubble5,
    alt: "plant 5",
    size: 230,
    top: 30,
    left: "78%",
    duration: 3.9,
    delay: 1.9,
  },
];

export default function BubbleHero() {
  return (
    <div className="bubble-hero">
      {BUBBLES.map((b, i) => (
        <div
          key={i}
          className="bubble-wrap"
          style={{
            width: b.size,
            height: b.size,
            top: b.top,
            left: b.left,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
          }}
        >
          <img src={b.src} alt={b.alt} />
        </div>
      ))}
    </div>
  );
}

import { contacts } from "@/config/registration";
import { Link } from "@/design-system/link/link";
import { Text } from "@/design-system/text/text";
import "./intro.css";

export function Intro() {
  return (
    <header className="intro">
      <Text variant="eyebrow" align="center" className="intro__eyebrow">
        бонмо́
      </Text>
      <Text variant="display">Привет, дорогой друг!</Text>
      <Text variant="lead" className="intro__lead">
        Это форма регистрации на встречи клуба бонмо́. Мы находимся в Петербурге, наши встречи проходят очно.
      </Text>
      <div className="intro__contacts">
        <Text variant="meta">
          Наш телеграм-канал — <Link href={contacts.channelUrl}>{contacts.channelLabel}</Link>
        </Text>
        <Text variant="meta">
          Со всеми вопросами и предложениями обращайтесь к Лизе (тг{" "}
          <Link href={contacts.organizerUrl}>{contacts.organizerHandle}</Link>)
        </Text>
      </div>
    </header>
  );
}

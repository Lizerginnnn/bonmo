import { contacts } from "@/config/registration";
import { Link } from "@/design-system/link/link";
import { Text } from "@/design-system/text/text";
import "./success-message.css";

export function SuccessMessage() {
  return (
    <div className="success-message" role="status">
      <p className="success-message__heart" aria-hidden="true">
        ♥
      </p>
      <Text variant="subtitle">
        Ваша анкета отправлена. Мы постараемся отправить вам подтверждение регистрации как можно быстрее, но если вам
        вдруг долго ничего не приходит — напишите в тг <Link href={contacts.organizerUrl}>{contacts.organizerHandle}</Link>
      </Text>
      <Text variant="quote" className="success-message__bye">
        До скорой встречи ♥ !
      </Text>
    </div>
  );
}

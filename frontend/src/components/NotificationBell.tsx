import { Badge } from "react-bootstrap";
import { IoIosNotificationsOutline } from "react-icons/io";

interface ComponentProps {
  count: number;
}

const NotificationBell = (props: ComponentProps) => {
  return (
    <div className="position-relative">
      <IoIosNotificationsOutline size={26} />
      {props.count > 0 && (
        <Badge className="bg-primary position-absolute translate-middle rounded-pill z-n1">
          {props.count}
        </Badge>
      )}
    </div>
  );
};

export default NotificationBell;

import { forwardRef, useImperativeHandle, useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";

const GroupChatDetails = forwardRef((props, ref) => {
  const { isGroupChat } = props;

  const [anchorEl, setAnchorEl] = useState(null);

  const menuOpen = Boolean(anchorEl);

  useImperativeHandle(ref, () => ({
    openMenu(event) {
      setAnchorEl(event.currentTarget);
    },
    closeMenu() {
      setAnchorEl(null);
    },
  }));

  return (
    <Menu
      id="group_details_menu"
      anchorEl={anchorEl}
      open={menuOpen && isGroupChat}
      onClose={() => setAnchorEl(null)}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      className="min-w-80 flex flex-row h-full"
    >
      <aside>
        <MenuItem>
          <InfoOutlineIcon className="mr-2" />
          Overview
        </MenuItem>
        <MenuItem>
          <PeopleAltOutlinedIcon className="mr-2" />
          Members
        </MenuItem>
      </aside>
      <section>
        <div className="">
          <h2 className="text-lg font-semibold mb-2">Group Chat Details</h2>
          <p className="text-sm text-gray-600">
            Here you can see the details of the group chat, including members,
            group description, and other relevant information.
          </p>
        </div>
      </section>
    </Menu>
  );
});

export default GroupChatDetails;

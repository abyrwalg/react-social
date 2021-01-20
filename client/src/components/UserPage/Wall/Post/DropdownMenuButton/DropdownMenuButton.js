import React from "react";

import "font-awesome/css/font-awesome.min.css";

const DropdownMenuButton = React.forwardRef(({ children, onClick }, ref) => (
  <i
    className="fa fa-ellipsis-h"
    aria-hidden="true"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
  </i>
));

export default DropdownMenuButton;

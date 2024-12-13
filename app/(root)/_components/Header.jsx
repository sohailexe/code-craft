import { SignOutButton, SignUpButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

const Header = async () => {
  console.log(1);

  const user = await currentUser(); //user from clerk

  if (user) {
    console.log(user.firstName);
  }

  console.log(2);

  return (
    <>
      <SignUpButton />
      <br />
      <SignOutButton />
    </>
  );
};

export default Header;

import { getUsers } from "@/app/actions/settings";
import { UsersList } from "./users-list";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-6">
      <UsersList initialUsers={users} />
    </div>
  );
}

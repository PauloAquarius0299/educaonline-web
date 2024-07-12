import { UserButton} from '@clerk/nextjs'

export default function Home() {
  return (
    <div>HOME Page
      <UserButton afterSignOutUrl="/sign-in" />
    </div>
  );
}

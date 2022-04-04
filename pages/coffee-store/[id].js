import { useRouter } from 'next/router';
import Link from 'next/link';

const CoffeeStore = () => {
  const router = useRouter();
  return (
    <div>
      <h1>Coffee Store Page {router.query.id}</h1>
      <Link href='/'>
        <a>Back to home</a>
      </Link>
    </div>
  );
};

export default CoffeeStore;

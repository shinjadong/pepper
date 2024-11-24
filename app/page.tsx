import { HomeClient } from './components/home-client';
import { generateMetadata } from './metadata';

export { generateMetadata };

export default async function Home() {
  return <HomeClient />;
}

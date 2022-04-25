import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useContext, useState } from 'react';
import Banner from '../components/banner.js';
import Card from '../components/card.js';
import useTrackLocation from '../hooks/use-track-location.js';
import { fetchCoffeeStores } from '../lib/coffee-stores.js';
import styles from '../styles/Home.module.css';
import { ACTION_TYPES, StoreContext } from '../store/store-context';

export async function getStaticProps() {
  const coffeeStores = await fetchCoffeeStores();
  return {
    props: { coffeeStores },
  };
}

export default function Home(props) {
  const { handleTrackLocation, locationError, isFindingLocation } =
    useTrackLocation();

  // const [coffeeStores, setCoffeeStores] = useState('');
  const [coffeeStoresError, setCoffeeStoresError] = useState(null);

  const { dispatch, state } = useContext(StoreContext);

  const { coffeeStores, latLong } = state;

  const fetchedCoffeStores = async () => {
    if (latLong) {
      try {
        const res = await fetch(
          `/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=30`
        );
        console.log({ res });
        const coffeeStores = await res.json();
        // setCoffeeStores(fetchedCoffeeStoresData);
        dispatch({
          type: ACTION_TYPES.SET_COFFEE_STORES,
          payload: {
            coffeeStores,
          },
        });
        setCoffeeStoresError('');
      } catch (error) {
        console.log({ error });
        setCoffeeStoresError(error.message);
      }
    }
  };

  useEffect(() => {
    fetchedCoffeStores();
  }, [latLong]);

  const handleOnBannerBtnClick = () => {
    handleTrackLocation();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Finder</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? 'Locating...' : 'View stores nerby'}
          handleOnClick={handleOnBannerBtnClick}
        />
        {locationError && <p>Something went wrong: {locationError}</p>}
        {coffeeStoresError && <p>Something went wrong: {coffeeStoresError}</p>}
        <div className={styles.heroImage}>
          <Image src='/static/hero-image.svg' width={700} height={400} />
        </div>
        {coffeeStores && coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores nearby</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((coffeeStore) => {
                return (
                  <Card
                    key={coffeeStore.fsq_id}
                    name={coffeeStore.name}
                    imgUrl={
                      coffeeStore.imgUrl ||
                      'https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80'
                    }
                    href={`/coffee-store/${coffeeStore.fsq_id}`}
                    className={styles.card}
                  />
                );
              })}
            </div>
          </div>
        )}
        {props.coffeeStores && props.coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Košice stores</h2>
            <div className={styles.cardLayout}>
              {props.coffeeStores.map((coffeeStore) => {
                return (
                  <Card
                    key={coffeeStore.fsq_id}
                    name={coffeeStore.name}
                    imgUrl={
                      coffeeStore.imgUrl ||
                      'https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80'
                    }
                    href={`/coffee-store/${coffeeStore.fsq_id}`}
                    className={styles.card}
                  />
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

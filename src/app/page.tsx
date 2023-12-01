'use client';
import { useState, useEffect } from 'react';

type ItemType = {
  url: string;
};

interface Listing {
  price: number;
  state: string;
}

export default function Page() {
  const [waterMintSeed, setwaterMintSeed] = useState<number>(12);
  const [waterMint, setwaterMint] = useState<number>(24);
  const [hotatoSeed, setHotatoSeed] = useState<number>(14);
  const [cookingMix, setcookingMix] = useState<number>(10);
  const [craftingMix, setcraftingMix] = useState<number>(100);
  const [clay, setclay] = useState<ItemType[]>([]); // Replace ItemType with your actual type
  const [brick, setbrick] = useState<ItemType[]>([]); // Replace ItemType with your actual type
  const [salt, setsalt] = useState<ItemType[]>([]); // Replace ItemType with your actual type
  const [constructionPowder, setconstructionPowder] = useState<ItemType[]>([]); // Replace ItemType with your actual type
  const [hotato, sethotato] = useState<ItemType[]>([]); // Replace ItemType with your actual type
  const [hotka, sethotka] = useState<ItemType[]>([]); // Replace ItemType with your actual type
  const [energyDrink, setenergyDrink] = useState<ItemType[]>([]); // Replace ItemType with your actual type
  const [popberryWine, setpopberryWine] = useState<ItemType[]>([]); // Replace ItemType with your actual type
  const [popberry, setpopberry] = useState<ItemType[]>([]); // Replace ItemType with your actual type
  const [queenBee, setqueenBee] = useState<ItemType[]>([]); // Replace ItemType with your actual type
  const [voidtonium, setvoidtonium] = useState<ItemType[]>([]); // Replace ItemType with your actual type
  const marketplaceURL = 'https://pixels-server.pixels.xyz/v1/marketplace';

  useEffect(() => {
    const fetchData = async (
      url: string,
      setData: React.Dispatch<React.SetStateAction<number>>,
      multiplier: number
    ) => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        const activeListings = data.listings.filter(
          (listing: Listing) => listing.state === 'active'
        );
        const sortedListings = activeListings.sort(
          (a: Listing, b: Listing) => a.price - b.price
        );
        let totalPrice = 0;
        let totalQuantity = 0;
        const maxQuantity =
          sortedListings[0].itemId === 'itm_popberryFruit' ? 3000 : 200;

        for (const listing of sortedListings) {
          const quantity = Math.min(
            listing.quantity,
            maxQuantity - totalQuantity
          );
          totalPrice += listing.price * quantity;
          totalQuantity += quantity;
          if (totalQuantity >= maxQuantity) break;
        }

        const averagePrice = parseFloat(
          (totalPrice / totalQuantity).toFixed(2)
        );
        setData(parseFloat((averagePrice * multiplier).toFixed(2)));
      } catch (error) {
        console.error('Fetch failed:', error);
      }
    };

    fetchData(marketplaceURL + '/item/itm_clay', setclay, 1);
    fetchData(marketplaceURL + '/item/itm_brick', setbrick, 1);
    fetchData(marketplaceURL + '/item/itm_Marble', setsalt, 1);
    fetchData(marketplaceURL + '/item/itm_hotato', sethotato, 1);
    fetchData(marketplaceURL + '/item/itm_hotato_hotka', sethotka, 1);
    fetchData(marketplaceURL + '/item/itm_energyDrink', setenergyDrink, 1);
    fetchData(marketplaceURL + '/item/itm_popberrywine', setpopberryWine, 1);
    fetchData(marketplaceURL + '/item/itm_popberryFruit', setpopberry, 1);
    fetchData(marketplaceURL + '/item/itm_queenbee', setqueenBee, 1);
    fetchData(marketplaceURL + '/item/itm_void', setvoidtonium, 1);
    fetchData(
      marketplaceURL + '/item/itm_constructionPowder',
      setconstructionPowder,
      1
    );
  }, []);

  function calculateBtoE(profit: number, energy: number) {
    return (profit / energy).toFixed(2);
  }

  function calculateProfit(sellPrice: number, buyPrice: number) {
    return (sellPrice - buyPrice).toFixed(2);
  }

  function isWorth(btoe: number) {
    const worth = btoe > 2 ? 'Yes' : 'No';
    return worth;
  }

  function calculateTotal(
    price1: number,
    price2: number,
    price3: number = 0,
    price4: number = 0
  ): string {
    return (price1 + price2 + price3 + price4).toFixed(2);
  }

  function TableRow({
    index,
    process,
    material1,
    material2,
    material3,
    material4,
    price1,
    price2,
    price3,
    price4,
    product,
    sellPrice,
    energy,
    calculateTotal,
    calculateProfit,
    calculateBtoE,
    isWorth
  }) {
    const totalCost = parseInt(
      calculateTotal(price1, price2 || 0, price3 || 0, price4 || 0)
    ).toFixed(2);
    const profit = calculateProfit(sellPrice, totalCost);
    const btoe = calculateBtoE(profit, energy);
    const worth = isWorth(btoe);

    const worthClass = worth === 'No' ? 'bg-yellow-700' : '';
    const profitClass = profit > 0 ? 'bg-green-700' : 'bg-red-7d00';

    return (
      <tr className={`${profitClass} ${worthClass}`}>
        <th>{index + 1}</th>
        <td>{process}</td>
        <td>{material1}</td>
        <td>{price1}</td>
        <td>{material2 || ''}</td>
        <td>{price2 || ''}</td>
        <td>{material3 || ''}</td>
        <td>{price3 || ''}</td>
        <td>{material4 || ''}</td>
        <td>{price4 || ''}</td>
        <td>{totalCost}</td>
        <td>{product}</td>
        <td>{sellPrice}</td>
        <td>{profit}</td>
        <td>{energy}</td>
        <td>{btoe}</td>
        <td>{worth}</td>
      </tr>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Process</th>
              <th>Raw Material 1</th>
              <th>Price Average</th>
              <th>Raw Material 2</th>
              <th>Price Average</th>
              <th>Raw Material 3</th>
              <th>Price Average</th>
              <th>Raw Material 4</th>
              <th>Price Average</th>
              <th>Total</th>
              <th>Material Produced</th>
              <th>Sell Price</th>
              <th>Profit</th>
              <th>Energy Needed</th>
              <th>B/E</th>
              <th>Worth?</th>
            </tr>
          </thead>
          <tbody>
            <TableRow
              index={0}
              process="Clay to Bricks"
              material1="Clay x36"
              price1={clay * 36}
              product="Bricks x12"
              sellPrice={brick * 12}
              energy={48}
              calculateTotal={calculateTotal}
              calculateProfit={calculateProfit}
              calculateBtoE={calculateBtoE}
              isWorth={isWorth}
            />
            <TableRow
              index={1}
              process="Construction Powder"
              material1="Bricks x2"
              price1={brick * 2}
              material2="Salt Blocks x4"
              price2={salt * 4}
              product="Construction Powder x1"
              sellPrice={constructionPowder}
              energy={5}
              calculateTotal={calculateTotal}
              calculateProfit={calculateProfit}
              calculateBtoE={calculateBtoE}
              isWorth={isWorth}
            />
            <TableRow
              index={2}
              process="Hotka"
              material1="Hotato x24"
              price1={hotato * 24}
              material2="Cooking Mix x10"
              price2={cookingMix * 10}
              product="Hotka x1"
              sellPrice={hotka}
              energy={2}
              calculateTotal={calculateTotal}
              calculateProfit={calculateProfit}
              calculateBtoE={calculateBtoE}
              isWorth={isWorth}
            />
            <TableRow
              index={3}
              process="Watermint Farming w/ Energy Drink"
              material1="WatermintSeed x60"
              price1={waterMint * 60}
              material2="Energy Drink x10"
              price2={energyDrink * 10}
              product="Watermint x60"
              sellPrice={waterMint * 60}
              energy={440}
              calculateTotal={calculateTotal}
              calculateProfit={calculateProfit}
              calculateBtoE={calculateBtoE}
              isWorth={isWorth}
            />
            <TableRow
              index={4}
              process="Hotato Farming w/ Energy Drink"
              material1="HotatoSeed x60"
              price1={hotatoSeed * 60}
              material2="Energy Drink x10"
              price2={energyDrink * 10}
              product="Hotato x60"
              sellPrice={hotato * 60}
              energy={630}
              calculateTotal={calculateTotal}
              calculateProfit={calculateProfit}
              calculateBtoE={calculateBtoE}
              isWorth={isWorth}
            />
            <TableRow
              index={5}
              process="Popberry Wine"
              material1="Popberry x24"
              price1={popberry * 24}
              material2="Cooking Mix x10"
              price2={cookingMix * 10}
              product="PopberryWine x1"
              sellPrice={popberryWine * 1}
              energy={2}
              calculateTotal={calculateTotal}
              calculateProfit={calculateProfit}
              calculateBtoE={calculateBtoE}
              isWorth={isWorth}
            />
            <TableRow
              index={6}
              process="Pure Hotato"
              material1="Construction Powder x3"
              price1={constructionPowder * 3}
              material2="Crafting Mix x3"
              price2={craftingMix * 3}
              material3="Queen Bee x1"
              price3={queenBee * 1}
              material4="Voidtonium x1.25"
              price4={voidtonium * 1.25}
              product="Hotato x100"
              sellPrice={hotato * 100}
              energy={1050}
              calculateTotal={calculateTotal}
              calculateProfit={calculateProfit}
              calculateBtoE={calculateBtoE}
              isWorth={isWorth}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
}

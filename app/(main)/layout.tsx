import Sidebar from "@/components/Sidebar";
import UploadSongModal from "@/components/UploadSongModal";
import SubscriptionModal from "@/components/SubscriptionModal";
import Player from "@/components/Player";
import PlaylistModal from "@/components/PlaylistModal";
import getProductsWithPrices from "@/serverActions/getProductsWithPrices";
import "react-tooltip/dist/react-tooltip.css";

interface Props {
  children: React.ReactNode
};

const RootLayout = async ({children}: Props) => {
  const productsWithPrices = await getProductsWithPrices();

  return (
    <main className="flex gap-2 w-full h-screen text-white bg-black">
      <UploadSongModal />
      <SubscriptionModal products={productsWithPrices} />
      <PlaylistModal />
      <Sidebar/>
      {children}
      <Player />
    </main>
  )
};

export default RootLayout;
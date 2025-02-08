interface ListOfUserToursProps {
  profileActive: string;
}

export default function FavouritTour( {profileActive }: ListOfUserToursProps) {
  

  return (
    <div className={`tour flex flex-col gap-5 pb-20 ${profileActive === 'favourit' ? '': 'hidden'}`}>
      favourit
    </div>
  );
}
const User = require('../models/UserModel');
const Reservation = require('../models/ReserveModel');

async function seatsController(req, res) {
  const selectedReservee = req.body.reservee;

  console.log('Selected Reservee:', selectedReservee);

  try {
    // Find the user's profile based on the selectedReservee value in the MongoDB
    const selectedUser = await User.findOne({ username: selectedReservee });

    console.log('Selected User:', selectedUser);

    if (!selectedUser) {
      // Handle case when the selected user doesn't exist

      //res.send('Selected user not found');
      return res.status(400).send('<script>alert("No User Selected"); window.location.href = "/seat_selection";</script>');
      return;
    }

    
    const latestReservation = await Reservation.findOne({ seatNum: -1 }).sort({ _id: -1 });
    //await Reservation.deleteOne({ _id: latestReservation._id });
    
    if (latestReservation) {
      // If a reservation with seatNum: -1 is found, delete it
      await Reservation.deleteOne({ _id: latestReservation._id });
      console.log('Latest reservation deleted successfully.');
    } else {
      console.log('No reservation with seatNum: -1 found.');
    } 
    

    // Render the profile page with the selected user's data
    res.render('other_profiles', selectedUser);
  } catch (error) {
    // Handle any database errors
    console.error('Error fetching user:', error);
    res.send('Error fetching user profile');
  }
}

module.exports = seatsController;

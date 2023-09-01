require('dotenv').config();


const useravailiblitylimit = async (req, res) => {
    try {
        const customer = await stripe.paymentIntents.list();
        let allfilter = customer.data.filter((x) => x.metadata["Customer Email"] === req?.body?.email)
        //         const currentTime = new Date().getTime(); // Get the current time in milliseconds
        // console.log(allfilter)
        allfilter.sort((a, b) => {
            return new Date(b.created) - new Date(a.created);
        });
        // this is the last payment he/she made  now we need to check if it has been 1 month or not if its , then take him out
        console.log(allfilter[0])
        // 30 is days if juniad you want to confirm make it 1 you will see it console yahoo it means it has been one day
        const thirtyDaysInMilliseconds = 30 * 24 * 60 * 60 * 1000;
        let lastdate = new Date(allfilter[0].created * 1000)
        let currentdate = new Date() - thirtyDaysInMilliseconds
        // console.log(currentdate.toLocaleString(undefined),lastdate.toLocaleString(undefined))
        if (lastdate < currentdate) {
            return "Unsubscribed";
        }
        else {
            return "Subscribed";
        }

    } catch (error) {
        console.error('Error listing subscribers:', error);
        res.send({
            errMsg: error.message,
            Response: "stripe error"
        })
    }
}

const stripeFunc = async () => {
    // const customers = await stripe.customers.list();
    // console.log(customers.data)
    // return customers.data;
    try {
        const subscribers = await stripe.subscriptions.list();

        console.log(subscribers)
    } catch (error) {
        console.error('Error listing subscribers:', error);
    }
}
module.exports = useravailiblitylimit;

import { stripe } from "./stripe.ts";
// Import Supabase client
import { supabaseAdmin } from "./supabase.ts";

// WARNING: The service role key has admin priviliges and should only be used in secure server environments!
export const createOrRetrieveCustomer = async (authHeader: string) => {
  try {
    // Get JWT from auth header
    const jwt = authHeader.replace("Bearer ", "");
    console.log("jwt created ✅: ", jwt);
    // Get the user object
    const { data: { user } } = await supabaseAdmin.auth.getUser(jwt);
    if (!user) throw new Error("No user found for JWT!");

    console.log("user created 🏋🏽‍♀️: ", user);

    // Check if the user already has a Stripe customer ID in the Database.
    //The Auth user returned is actually the uid of the user.
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("stripe_customer_id")
      .eq("uid", user?.id);

    if (error) throw error;
    if (data[0]?.stripe_customer_id !== null) {
      // Exactly one customer found, return it.
      const customer = data[0]?.stripe_customer_id;
      console.log(`Found customer id: ${customer}`);
      return customer;
    }
    if (data[0]?.stripe_customer_id === null) {
      // Create customer object in Stripe.
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { uid: user.id },
      });
      console.log(
        `New customer "${customer.id}" created for user "${user.id}"`,
      );
      // Insert new customer into DB
      const { error } = await supabaseAdmin
        .from("users")
        .update({
          stripe_customer_id: customer.id,
        })
        .eq("uid", user?.id);
      //.throwOnError();
      if (error) console.log("Error:  ❌ ", error.message);
      return customer.id;
    } else {throw new Error(
        `Unexpected count of customer rows: ${data?.length}`,
      );}
  } catch (error) {
    console.error("Error: ", error);
  }
};

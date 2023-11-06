// SubscriptionScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const SubscriptionScreen = ({ isVisible }) => {
  // isVisible would typically be a prop passed down to control the modal's visibility

  // if (!isVisible) return null; // Renders nothing if not visible

  return (
    <View style={styles.container}>
      <View style={styles.modalView}>
        <Text style={styles.modalTitle}>Circuits Premium Pass</Text>

        <View style={styles.featuresList}>
          <Text style={styles.featureItem}>Unlimited timer creation</Text>
          <Text style={styles.featureItem}>Highly customizable</Text>
          {/* Add more feature items here */}
        </View>

        <View style={styles.plansContainer}>
          <TouchableOpacity style={styles.planButton}>
            <Text style={styles.planText}>Monthly Pass - $0.99/month</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.planButton}>
            <Text style={styles.planText}>Lifetime Access - $9.99</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.continueButton}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.restoreText}>Restore purchase</Text>
        </TouchableOpacity>

        <Text style={styles.descriptionText}>
          Description of how purchases will be handled. Charged to your Apple ID account...
          {/* Add your full description here */}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  featuresList: {
    alignSelf: 'stretch',
    marginBottom: 15,
  },
  featureItem: {
    fontSize: 16,
    // Add more styling for the feature item text
  },
  plansContainer: {
    alignSelf: 'stretch',
    marginBottom: 15,
  },
  planButton: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#E0E0E0', // Change as per your design
    borderRadius: 10,
    // Add more styling for the plan button
  },
  planText: {
    fontSize: 16,
    // Add more styling for the plan text
  },
  continueButton: {
    backgroundColor: '#0000FF', // Change as per your design
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    // Add more styling for the continue button
  },
  continueText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    // Add more styling for the continue text
  },
  restoreText: {
    marginTop: 15,
    color: '#0000FF', // Change as per your design
    textDecorationLine: 'underline',
    // Add more styling for the restore purchase text
  },
  descriptionText: {
    marginTop: 15,
    fontSize: 12,
    color: 'gray',
    textAlign: 'center',
    // Add more styling for the description text
  },
});

export default SubscriptionScreen;

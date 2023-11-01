import React from 'react';
import { ScrollView, Text, StyleSheet, SafeAreaView, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import Screen from '../components/Screen';
import NavHeader from '../components/NavHeader';
import IconButton from "../components/buttons/IconButton"
import { useSettings } from '../contexts/SettingsContext';
import { useNavigation } from "@react-navigation/core";
import routes from "../navigation/routes";
import { INFO_FONT_SIZE } from '../config/appConstants'

const PrivacyPolicyScreen = () => {

    const { theme } = useSettings();
    const navigation = useNavigation();
    const styles = getStyles(theme);

    return (
        <Screen style={styles.container}>
            <NavHeader
                LeftComponent={
                    <IconButton
                        iconName={"chevron-left"}
                        IconFamily={Feather}
                        iconSize={52}
                        foregroundColor={theme.blue}
                        onPress={() => navigation.navigate(routes.SETTINGS_SCREEN)}
                        style={{ alignItems: 'flex-start', marginLeft: 7 }}
                    />}
                headerText='Privacy Policy'
            />
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Text style={styles.title}>Privacy Policy</Text>

                <Text style={styles.subtitle}>Last updated: October 25, 2023</Text>

                <Text style={styles.sectionTitle}>1. Introduction</Text>
                <Text style={styles.text}>
                    At Circuits, we prioritize your privacy. This policy explains our practices concerning the personal data we collect from you or about you on this app or via our services.
                </Text>

                <Text style={styles.sectionTitle}>2. No Data Collection</Text>
                <Text style={styles.text}>
                    Circuits does not collect or store any personal or non-personal data from its users. We do not require any form of registration, login or user input to provide our services.
                </Text>

                <Text style={styles.sectionTitle}>3. No Internet Connection Required</Text>
                <Text style={styles.text}>
                    Our app operates without the need for an internet connection. Therefore, we don't have any network-based data transmission, ensuring further privacy for our users.
                </Text>

                <Text style={styles.sectionTitle}>4. No Third-Party Integration</Text>
                <Text style={styles.text}>
                    We do not incorporate any third-party APIs, advertisements, or other external services that might collect or have access to your personal data.
                </Text>

                <Text style={styles.sectionTitle}>5. Changes to this Policy</Text>
                <Text style={styles.text}>
                    We may update our Privacy Policy occasionally. Any changes will be posted on this page, so you're always aware of what information we collect and how we use it.
                </Text>

                <Text style={styles.sectionTitle}>6. Contact Us</Text>
                <Text style={styles.text}>
                    If you have any questions regarding this privacy policy, you can contact us at: circuit.timer@gmail.com
                </Text>
            </ScrollView>
        </Screen>
    );
};

const getStyles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        scrollView: {
            padding: 16,
        },
        title: {
            fontSize: 30,
            fontWeight: '600',
            marginBottom: 16,
            color: theme.text
        },
        subtitle: {
            fontSize: 18,
            marginBottom: 16,
            color: theme.text87
        },
        sectionTitle: {
            fontSize: 20,
            fontWeight: '600',
            marginTop: 16,
            marginBottom: 8,
            color: theme.text87
        },
        text: {
            fontSize: INFO_FONT_SIZE,
            lineHeight: 24,
            marginBottom: 8,
            color: theme.text87
        },
    });

export default PrivacyPolicyScreen;

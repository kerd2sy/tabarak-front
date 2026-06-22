import React, { useState, useMemo } from 'react';
import { TouchableOpacity, Alert, View, Modal, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Main Screens
import { PharmacyDashboard } from '../screens/Pharmacy/PharmacyDashboard';
import { OrderTracking } from '../screens/Operations/Tracking';
import { RecentProducts } from '../screens/Operations/RecentProducts';
import { Search } from '../screens/Operations/Search';
import { AccountStatement } from '../screens/Account/AccountStatement';
import { AddPharmacy } from '../screens/Pharmacy/AddPharmacy';
import { AccountSettingsHub } from '../screens/Account/AccountSettingsHub';
import { BackupSettings } from '../screens/Account/BackupSettings';

// Unified Screens
import { TransactionsList } from '../screens/Transactions/TransactionsList';
import { TransactionDetails } from '../screens/Transactions/TransactionDetails';
import { AccountActivityList } from '../screens/Account/AccountActivityList';

// Profile & Settings (Internal Screens)
import { Profile } from '../screens/Account/Profile';
import { EditProfile } from '../screens/Account/EditProfile';
import { Notifications } from '../screens/Operations/Notifications';
import { PharmacySettings } from '../screens/Pharmacy/PharmacySettings';
import { Security } from '../screens/Account/Security';
import { ChangePassword } from '../screens/Account/ChangePassword';

export type RouteHandler = React.ComponentType<any>;

export interface RouteConfig {
  component: RouteHandler;
  paramName?: string;
}

// --- Custom Inline Calendar ---
const CustomInlineCalendar = ({ date, onDateChange }: { date: Date, onDateChange: (d: Date) => void }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date(date.getFullYear(), date.getMonth(), 1));

    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDayIndex = currentMonth.getDay(); // 0 = Sunday

    const days = useMemo(() => {
        let emptyDays = Array(firstDayIndex).fill(null);
        let monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        return [...emptyDays, ...monthDays];
    }, [daysInMonth, firstDayIndex]);

    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

    const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    const weekDays = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];

    return (
        <View style={{ width: '100%', padding: 12 }}>
            {/* Header */}
            <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingHorizontal: 4 }}>
                <TouchableOpacity onPress={prevMonth} style={{ padding: 8, backgroundColor: '#E3F2FD', borderRadius: 14 }}>
                    <Ionicons name="chevron-forward" size={22} color="#1976D2" />
                </TouchableOpacity>
                <Text style={{ fontSize: 19, fontWeight: '800', color: '#1A1A1A' }}>
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </Text>
                <TouchableOpacity onPress={nextMonth} style={{ padding: 8, backgroundColor: '#E3F2FD', borderRadius: 14 }}>
                    <Ionicons name="chevron-back" size={22} color="#1976D2" />
                </TouchableOpacity>
            </View>

            {/* Weekdays */}
            <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 12 }}>
                {weekDays.map((wd, i) => (
                    <Text key={i} style={{ width: '13%', textAlign: 'center', fontWeight: '700', color: '#757575', fontSize: 13 }}>{wd}</Text>
                ))}
            </View>

            {/* Days Grid */}
            <View style={{ flexDirection: 'row-reverse', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                {days.map((d, i) => {
                    if (!d) return <View key={i} style={{ width: '14.28%', height: 44 }} />;
                    
                    const isSelected = date.getDate() === d && date.getMonth() === currentMonth.getMonth() && date.getFullYear() === currentMonth.getFullYear();
                    const isToday = new Date().getDate() === d && new Date().getMonth() === currentMonth.getMonth() && new Date().getFullYear() === currentMonth.getFullYear();

                    return (
                        <TouchableOpacity 
                            key={i} 
                            onPress={() => onDateChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d))}
                            style={{ 
                                width: '14.28%', height: 44, justifyContent: 'center', alignItems: 'center', 
                                marginBottom: 6
                            }}
                        >
                            <View style={[{ 
                                width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center',
                                backgroundColor: isSelected ? '#1976D2' : (isToday ? '#E3F2FD' : 'transparent')
                            }, isSelected && { shadowColor: '#1976D2', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 6, elevation: 4 }]}>
                                <Text style={{ 
                                    fontSize: 16, fontWeight: isSelected || isToday ? '800' : '600', 
                                    color: isSelected ? '#ffffff' : (isToday ? '#1976D2' : '#333333') 
                                }}>
                                    {d}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

// --- List Wrappers ---
const FilterableTransactionsList = ({ type, title, accentColor, emptyText }: { type: any, title: string, accentColor: string, emptyText: string }) => {
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [showPicker, setShowPicker] = useState(false);
    const [tempDate, setTempDate] = useState<Date>(new Date());

    const dateFilterStr = date ? date.toISOString().split('T')[0] : '';

    return (
        <View style={{ flex: 1 }}>
            <TransactionsList 
                type={type} 
                title={title} 
                accentColor={accentColor} 
                emptyText={emptyText} 
                dateFilter={dateFilterStr}
                headerAction={
                    <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 10 }}>
                        {date && (
                            <TouchableOpacity onPress={() => setDate(undefined)} style={{ padding: 8 }}>
                                <Ionicons name="close-circle" size={24} color="#F44336" />
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity 
                            onPress={() => {
                                setTempDate(date || new Date());
                                setShowPicker(true);
                            }}
                            style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: date ? accentColor : `${accentColor}15`, justifyContent: 'center', alignItems: 'center' }}
                        >
                            <Ionicons name="filter" size={24} color={date ? "#fff" : accentColor} />
                        </TouchableOpacity>
                    </View>
                }
            />
            
            <Modal
                visible={showPicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowPicker(false)}
            >
                <TouchableOpacity 
                    style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }} 
                    activeOpacity={1} 
                    onPress={() => setShowPicker(false)}
                >
                    <TouchableOpacity 
                        activeOpacity={1} 
                        style={{ backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40 }}
                    >
                        <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <Text style={{ fontSize: 20, fontWeight: '900', color: '#1A1A1A' }}>تصفية بالتاريخ</Text>
                            <TouchableOpacity onPress={() => setShowPicker(false)} style={{ backgroundColor: '#F5F5F5', padding: 8, borderRadius: 16 }}>
                                <Ionicons name="close" size={22} color="#666" />
                            </TouchableOpacity>
                        </View>
                        
                        <View style={{ alignItems: 'center', backgroundColor: '#F8F9FA', borderRadius: 20, padding: 10, minHeight: 320 }}>
                            <CustomInlineCalendar 
                                date={tempDate} 
                                onDateChange={(newDate) => setTempDate(newDate)} 
                            />
                        </View>
                        
                        <TouchableOpacity 
                            style={{ backgroundColor: accentColor, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 24, shadowColor: accentColor, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }}
                            onPress={() => {
                                setDate(tempDate);
                                setShowPicker(false);
                            }}
                        >
                            <Text style={{ color: '#fff', fontSize: 17, fontWeight: '800' }}>عرض النتائج</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const PurchasesList = () => <FilterableTransactionsList type="purchases" title="سجل المشتريات" accentColor="#2196F3" emptyText="لا توجد مشتريات" />;
const SalesList = () => <FilterableTransactionsList type="sales" title="سجل المبيعات" accentColor="#795548" emptyText="لا توجد مبيعات" />;
const ReturnsList = () => <FilterableTransactionsList type="returns" title="سجل المرتجعات" accentColor="#F44336" emptyText="لا توجد مرتجعات" />;
const CashList = () => <FilterableTransactionsList type="cash" title="سجل النقدية" accentColor="#FF9800" emptyText="لا يوجد سجل نقدية" />;

// --- Detail Wrappers ---
const PurchaseDetailsWrapper = (props: any) => <TransactionDetails type="purchase" titlePrefix="فاتورة شراء" accentColor="#2196F3" {...props} />;
const SalesDetailsWrapper = (props: any) => <TransactionDetails type="sales" titlePrefix="فاتورة بيع" accentColor="#795548" {...props} />;
const ReturnDetailsWrapper = (props: any) => {
    const isSalesReturn = String(props.id || '').startsWith('OR_');
    return <TransactionDetails type="return" titlePrefix={isSalesReturn ? "مردود مبيعات" : "فاتورة مرتجع"} accentColor="#F44336" {...props} />;
};

// --- Activity Wrappers ---
const DevicesList = () => <AccountActivityList type="devices" />;
const LoginActivityList = () => <AccountActivityList type="login_activity" />;

export const PHARMACY_CATCHALL_MAP: Record<string, RouteConfig> = {
  // 1-level routes
  'dashboard': { component: PharmacyDashboard },
  'cash': { component: CashList },
  'orders': { component: OrderTracking },
  'products': { component: RecentProducts },
  'search': { component: Search },
  'account-statement': { component: AccountStatement },
  'add-pharmacy': { component: AddPharmacy },
  'settings': { component: AccountSettingsHub },
  'backup': { component: BackupSettings },
  
  // Feature Groups
  'purchases': { component: PurchasesList },
  'purchases/[id]': { component: PurchaseDetailsWrapper, paramName: 'id' },
  
  'returns': { component: ReturnsList },
  'returns/[id]': { component: ReturnDetailsWrapper, paramName: 'id' },
  
  'sales': { component: SalesList },
  'sales/[id]': { component: SalesDetailsWrapper, paramName: 'id' },

  // Sub-settings routes (reachable via Hub)
  'profile': { component: Profile },
  'profile/edit': { component: EditProfile },
  'profile/change-password': { component: ChangePassword },
  'profile/security': { component: Security },
  'profile/devices': { component: DevicesList },
  
  'pharmacy-settings': { component: PharmacySettings },
  'settings/pharmacy': { component: PharmacySettings },
  
  'notifications': { component: Notifications },
  'login-activity': { component: LoginActivityList },
  'tracking': { component: OrderTracking },
};

/**
 * Resolves a path array to a component and its parameters
 */
export const resolvePharmacyRoute = (rest: string[]) => {
  if (!rest || rest.length === 0) return null;

  // Filter out empty segments or group markers like '(pharmacy)'
  const cleanSegments = rest.filter(s => s && s !== '(pharmacy)' && s !== 'pharmacy');
  const path = cleanSegments.join('/');
  
  // Direct match in the map
  if (PHARMACY_CATCHALL_MAP[path]) {
    return { config: PHARMACY_CATCHALL_MAP[path], params: {} };
  }

  // Parameterized match (e.g. purchases/123)
  if (cleanSegments.length === 2) {
    const pattern = `${cleanSegments[0]}/[id]`;
    if (PHARMACY_CATCHALL_MAP[pattern]) {
      const config = PHARMACY_CATCHALL_MAP[pattern];
      return { 
        config, 
        params: { [config.paramName || 'id']: cleanSegments[1] } 
      };
    }
  }

  // Final fallback: try just the first segment if there are many
  if (cleanSegments.length > 1 && PHARMACY_CATCHALL_MAP[cleanSegments[0]]) {
      return { config: PHARMACY_CATCHALL_MAP[cleanSegments[0]], params: {} };
  }
  
  return null;
};

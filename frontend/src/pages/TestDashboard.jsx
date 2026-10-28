import React from 'react';
import { useNavigate } from 'react-router-dom'; //[cite: 2]

export default function TestDashboard() {
  const navigate = useNavigate(); //[cite: 2]

  const handleLogout = () => { //[cite: 2]
    // Later, you'll clear tokens from local storage here[cite: 2]
    navigate('/login'); //[cite: 2]
  };

  const styles = {
    container: { display: 'flex', minHeight: '100vh', backgroundColor: '#F8F9FB', fontFamily: 'sans-serif', color: '#1E293B' },
    sidebar: { width: '260px', backgroundColor: '#5B4EFA', color: '#FFFFFF', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px 16px' },
    logoSection: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', fontWeight: 'bold', marginBottom: '32px', paddingLeft: '8px' },
    profileSection: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' },
    profileImage: { width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #7C72FF', marginBottom: '12px' },
    navMenu: { display: 'flex', flexDirection: 'column', gap: '8px' },
    navItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', color: '#E2E0FF', fontWeight: '500' },
    activeNavItem: { backgroundColor: '#7C72FF', color: '#FFFFFF' },
    proBanner: { backgroundColor: '#6C61FA', padding: '16px', borderRadius: '8px', marginTop: 'auto', fontSize: '12px' },
    mainContent: { flex: 1, padding: '32px 40px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' },
    headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
    searchBar: { display: 'flex', alignItems: 'center', backgroundColor: '#FFFFFF', padding: '8px 16px', borderRadius: '8px', border: '1px solid #E2E8F0', width: '280px' },
    originalBanner: { backgroundColor: '#E0E7FF', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
    grid4: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' },
    card: { backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', marginBottom: '16px' },
    statValue: { fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' },
    statChange: { fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' },
    positive: { color: '#10B981', fontWeight: '600' },
    negative: { color: '#EF4444', fontWeight: '600' },
    grid2: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' },
    barChartContainer: { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', marginTop: '24px', padding: '0 16px' },
    dayGroup: { display: 'flex', gap: '4px', alignItems: 'flex-end', height: '100%' },
    barPurple: { width: '12px', backgroundColor: '#6366F1', borderRadius: '4px 4px 0 0' },
    barBlue: { width: '12px', backgroundColor: '#3B82F6', borderRadius: '4px 4px 0 0' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '16px', textAlign: 'left', fontSize: '14px' },
    th: { padding: '12px 16px', color: '#64748B', fontWeight: '600', borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' },
    td: { padding: '16px', borderBottom: '1px solid #E2E8F0', color: '#1E293B' },
    badge: { padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '500' },
    badgeCompleted: { backgroundColor: '#D1FAE5', color: '#065F46' },
    badgePending: { backgroundColor: '#FEF3C7', color: '#92400E' },
    badgeFailed: { backgroundColor: '#FEE2E2', color: '#991B1B' }
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div>
          <div style={styles.logoSection}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#FFF', borderRadius: '50%' }}></div>
            mira.analytics
          </div>
          <div style={styles.profileSection}>
            <img src="https://i.pravatar.cc/150?img=11" alt="Profile" style={styles.profileImage} />
            <div style={{ fontWeight: 'bold' }}>Alexander</div>
            <div style={{ fontSize: '12px', color: '#E2E0FF', marginTop: '4px' }}>Platform Administrator</div>
          </div>
          <div style={styles.navMenu}>
            <div style={{ ...styles.navItem, ...styles.activeNavItem }}>
              <span>Dashboard</span>
            </div>
            <div style={styles.navItem}>Analytics Activity</div>
            <div style={styles.navItem}>System Integrations</div>
            <div style={styles.navItem}>Operation Log</div>
            <div style={styles.navItem}>System Settings</div>
          </div>
        </div>
        <div style={styles.proBanner}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Pro Features Active</div>
          <div style={{ color: '#D4D4FF' }}>Your enterprise license expires in 280 days.</div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        
        {/* Preserved Original Elements[cite: 2] */}
        <div style={styles.originalBanner}>
          <div>
            <h3 style={{ margin: 0 }}>🎉 You made it to the Test Dashboard!</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>You have successfully navigated through the auth flow.[cite: 2]</p>
          </div>
          <button onClick={handleLogout} style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#5B4EFA', color: '#FFF', border: 'none', borderRadius: '6px' }}>
            Logout {/*[cite: 2] */}
          </button>
        </div>

        {/* Header */}
        <div style={styles.headerRow}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Overview Dashboard</h1>
            <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: '14px' }}>Real-time synchronization and system load performance</p>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={styles.searchBar}>
              <span style={{ color: '#94A3B8', marginRight: '8px' }}>🔍</span>
              <input type="text" placeholder="Search telemetry logs..." style={{ border: 'none', outline: 'none', width: '100%' }} />
            </div>
            <div style={{ padding: '8px', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', cursor: 'pointer' }}>🔔</div>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div style={styles.grid4}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span>Total Transactions</span>
              <span style={{ backgroundColor: '#EEF2FF', color: '#6366F1', padding: '4px 8px', borderRadius: '4px' }}>📈</span>
            </div>
            <div style={styles.statValue}>2,482,900</div>
            <div style={styles.statChange}><span style={styles.positive}>↗ +12.4%</span> <span style={{ color: '#94A3B8' }}>since last month</span></div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span>Active Collectors</span>
              <span style={{ backgroundColor: '#F0F9FF', color: '#0EA5E9', padding: '4px 8px', borderRadius: '4px' }}>👥</span>
            </div>
            <div style={styles.statValue}>48,102</div>
            <div style={styles.statChange}><span style={styles.positive}>↗ +8.2%</span> <span style={{ color: '#94A3B8' }}>since last month</span></div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span>System Latency</span>
              <span style={{ backgroundColor: '#ECFDF5', color: '#10B981', padding: '4px 8px', borderRadius: '4px' }}>✓</span>
            </div>
            <div style={styles.statValue}>28 ms</div>
            <div style={styles.statChange}><span style={styles.negative}>↘ -3.1%</span> <span style={{ color: '#94A3B8' }}>since last month</span></div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span>Resource Load</span>
              <span style={{ backgroundColor: '#FFFBEB', color: '#D97706', padding: '4px 8px', borderRadius: '4px' }}>!</span>
            </div>
            <div style={styles.statValue}>73.4%</div>
            <div style={styles.statChange}><span style={styles.negative}>↘ +1.2%</span> <span style={{ color: '#94A3B8' }}>since last month</span></div>
          </div>
        </div>

        {/* Charts Row */}
        <div style={styles.grid2}>
          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '16px' }}>Weekly Execution Flow</h3>
              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#64748B' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#6366F1' }}></div>Incoming</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3B82F6' }}></div>Completed</span>
              </div>
            </div>
            {/* Mock Chart Area */}
            <div style={styles.barChartContainer}>
               {[
                 { day: 'Mon', h1: '60%', h2: '40%' }, { day: 'Tue', h1: '70%', h2: '45%' }, { day: 'Wed', h1: '50%', h2: '35%' },
                 { day: 'Thu', h1: '55%', h2: '40%' }, { day: 'Fri', h1: '90%', h2: '50%' }, { day: 'Sat', h1: '40%', h2: '30%' }, { day: 'Sun', h1: '35%', h2: '25%' }
               ].map((d) => (
                 <div key={d.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                   <div style={styles.dayGroup}>
                     <div style={{ ...styles.barPurple, height: d.h1 }}></div>
                     <div style={{ ...styles.barBlue, height: d.h2 }}></div>
                   </div>
                   <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '12px' }}>{d.day}</div>
                 </div>
               ))}
            </div>
          </div>
          
          <div style={styles.card}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>Resource Allocation</h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', marginTop: '24px' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'conic-gradient(#6366F1 0% 55%, #3B82F6 55% 88%, #22C55E 88% 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <div style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: '#FFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                   <span style={{ fontWeight: 'bold', fontSize: '18px' }}>100%</span>
                   <span style={{ fontSize: '10px', color: '#64748B' }}>System</span>
                 </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#64748B' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#6366F1' }}></div>Gateway (55%)</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3B82F6' }}></div>Services (33%)</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22C55E' }}></div>Internal (12%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Table Area */}
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>Recent Active Sessions</h3>
            <button style={{ padding: '6px 12px', color: '#6366F1', backgroundColor: '#EEF2FF', border: 'none', borderRadius: '6px', fontWeight: '500', cursor: 'pointer' }}>View Transaction logs</button>
          </div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Operator</th>
                <th style={styles.th}>Event Type</th>
                <th style={styles.th}>Timestamp</th>
                <th style={styles.th}>Payload Size</th>
                <th style={styles.th}>Process Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.td}><div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#E0E7FF' }}></div><b>Marcus Vance</b></div></td>
                <td style={styles.td}>Gateway Push</td>
                <td style={styles.td}>2 minutes ago</td>
                <td style={{ ...styles.td, fontWeight: 'bold' }}>2.4 MB</td>
                <td style={styles.td}><span style={{ ...styles.badge, ...styles.badgeCompleted }}>Completed</span></td>
              </tr>
              <tr>
                <td style={styles.td}><div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#E0E7FF' }}></div><b>Helena Rostova</b></div></td>
                <td style={styles.td}>Auth Validation</td>
                <td style={styles.td}>14 minutes ago</td>
                <td style={{ ...styles.td, fontWeight: 'bold' }}>124 KB</td>
                <td style={styles.td}><span style={{ ...styles.badge, ...styles.badgeCompleted }}>Completed</span></td>
              </tr>
              <tr>
                <td style={styles.td}><div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#E0E7FF' }}></div><b>Klaus Meyer</b></div></td>
                <td style={styles.td}>Bulk Compilation</td>
                <td style={styles.td}>1 hour ago</td>
                <td style={{ ...styles.td, fontWeight: 'bold' }}>41.8 MB</td>
                <td style={styles.td}><span style={{ ...styles.badge, ...styles.badgePending }}>Pending</span></td>
              </tr>
              <tr>
                <td style={styles.td}><div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#E0E7FF' }}></div><b>Siddharth Sen</b></div></td>
                <td style={styles.td}>Database Backup</td>
                <td style={styles.td}>3 hours ago</td>
                <td style={{ ...styles.td, fontWeight: 'bold' }}>1.2 GB</td>
                <td style={styles.td}><span style={{ ...styles.badge, ...styles.badgeFailed }}>Failed</span></td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
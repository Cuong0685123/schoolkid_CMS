import { Inter } from 'next/font/google';
import '@/styles/all.scss';
import Navbar from '@/components/navbar';
import styles from './page.module.scss';
import { AntdRegistry } from '@ant-design/nextjs-registry';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata = {
  title: "Schoolkid_cms",
  description: "",
  icons: {
    icon: '/images/favicon.ico'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <AntdRegistry>
          <div className={styles.wrapper}>
            {children}
          </div>
        </AntdRegistry>
      </body>
    </html>
  );
}

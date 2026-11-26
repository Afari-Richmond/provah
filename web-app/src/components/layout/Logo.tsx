import Link from "next/link";
import Image from "next/image";

export function Logo({ href = "/dashboard" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center">
      <Image
        src="/images/provah-logo.png"
        alt="Provah"
        width={1390}
        height={329}
        priority
        className="h-7 w-auto"
      />
    </Link>
  );
}

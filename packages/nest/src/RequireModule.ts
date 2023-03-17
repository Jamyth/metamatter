import { Module } from "./decorators/Module";
import { AnotherModule } from "./AnotherModule";

@Module({
    imports: [AnotherModule],
})
export class RequireModule {}
